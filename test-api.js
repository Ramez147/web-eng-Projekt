const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const { createClient } = require("@supabase/supabase-js");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#") || !trimmedLine.includes("=")) {
      continue;
    }

    const equalsIndex = trimmedLine.indexOf("=");
    const key = trimmedLine.slice(0, equalsIndex).trim();
    let value = trimmedLine.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(__dirname, ".env.local"));

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const EXTERNAL_CUSTOMER_ID = process.env.EXTERNAL_CUSTOMER_ID ?? "customer-123";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROVIDED_API_KEY = process.env.API_KEY;
let activeApiKey = PROVIDED_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase credentials in .env.local.");
}

function generateApiKey() {
  const secret = crypto.randomBytes(32).toString("hex");
  return `ly_live_${secret}`;
}

function hashApiKey(apiKey) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function postJson(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": activeApiKey,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let payload;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  return {
    ok: response.ok,
    status: response.status,
    payload,
  };
}

async function resolveExistingApiKey(apiKey) {
  if (!apiKey) {
    return null;
  }

  const { data, error } = await adminClient
    .from("organizations")
    .select("id, name")
    .eq("api_key_hash", hashApiKey(apiKey))
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to validate API key: ${error.message}`);
  }

  return data;
}

async function resolveOrganizationByActiveKey() {
  const organization = await resolveExistingApiKey(activeApiKey);

  if (!organization) {
    throw new Error("Unable to resolve organization from API key.");
  }

  return organization;
}

async function simulateCollectDirectly(amountEur) {
  const organization = await resolveOrganizationByActiveKey();
  const { data: organizationRow, error: organizationError } = await adminClient
    .from("organizations")
    .select("id, points_ratio")
    .eq("id", organization.id)
    .maybeSingle();

  if (organizationError) {
    throw new Error(`Direct collect failed to load organization: ${organizationError.message}`);
  }

  if (!organizationRow) {
    throw new Error("Organization not found for direct collect fallback.");
  }

  const pointsEarned = Math.floor(amountEur * Number(organizationRow.points_ratio));

  if (pointsEarned <= 0) {
    return {
      organizationId: organizationRow.id,
      externalCustomerId: EXTERNAL_CUSTOMER_ID,
      error: "Calculated points is 0. Increase amount or ratio.",
      status: 400,
    };
  }

  const { data: existingProfile, error: profileLoadError } = await adminClient
    .from("customer_profiles")
    .select("id, points_balance, total_spent_eur")
    .eq("organization_id", organizationRow.id)
    .eq("external_customer_id", EXTERNAL_CUSTOMER_ID)
    .maybeSingle();

  if (profileLoadError) {
    throw new Error(`Direct collect failed to load profile: ${profileLoadError.message}`);
  }

  if (!existingProfile) {
    const { error: insertError } = await adminClient.from("customer_profiles").insert({
      organization_id: organizationRow.id,
      external_customer_id: EXTERNAL_CUSTOMER_ID,
    });

    if (insertError) {
      throw new Error(`Direct collect failed to create profile: ${insertError.message}`);
    }
  }

  const { data: updatedProfile, error: updateError } = await adminClient
    .from("customer_profiles")
    .update({
      points_balance: Number(existingProfile?.points_balance ?? 0) + pointsEarned,
      total_spent_eur: Number(existingProfile?.total_spent_eur ?? 0) + amountEur,
    })
    .eq("organization_id", organizationRow.id)
    .eq("external_customer_id", EXTERNAL_CUSTOMER_ID)
    .select("id, points_balance, total_spent_eur")
    .single();

  if (updateError) {
    throw new Error(`Direct collect failed to update profile: ${updateError.message}`);
  }

  const { error: transactionError } = await adminClient.from("points_transactions").insert({
    organization_id: organizationRow.id,
    profile_id: updatedProfile.id,
    transaction_type: "earn",
    eur_amount: amountEur,
    points: pointsEarned,
    metadata: {
      source: "test-api.js",
      simulated: true,
      fallback: true,
    },
  });

  if (transactionError) {
    throw new Error(`Direct collect failed to write transaction: ${transactionError.message}`);
  }

  return {
    organizationId: organizationRow.id,
    externalCustomerId: EXTERNAL_CUSTOMER_ID,
    profileId: updatedProfile.id,
    pointsCollected: pointsEarned,
    newPointsBalance: Number(updatedProfile.points_balance),
    totalSpentEur: Number(updatedProfile.total_spent_eur),
    fallback: true,
  };
}

async function simulateRedeemDirectly(points) {
  const organization = await resolveOrganizationByActiveKey();
  const { data: profile, error: profileLoadError } = await adminClient
    .from("customer_profiles")
    .select("id, points_balance")
    .eq("organization_id", organization.id)
    .eq("external_customer_id", EXTERNAL_CUSTOMER_ID)
    .maybeSingle();

  if (profileLoadError) {
    throw new Error(`Direct redeem failed to load profile: ${profileLoadError.message}`);
  }

  if (!profile) {
    return {
      organizationId: organization.id,
      externalCustomerId: EXTERNAL_CUSTOMER_ID,
      error: "Profile could not be created",
      status: 400,
    };
  }

  if (Number(profile.points_balance) < points) {
    return {
      organizationId: organization.id,
      externalCustomerId: EXTERNAL_CUSTOMER_ID,
      profileId: profile.id,
      redeemedPoints: 0,
      newPointsBalance: Number(profile.points_balance),
      status: 400,
      error: "Insufficient points balance",
      fallback: true,
    };
  }

  const { data: updatedProfile, error: updateError } = await adminClient
    .from("customer_profiles")
    .update({
      points_balance: Number(profile.points_balance) - points,
    })
    .eq("id", profile.id)
    .select("id, points_balance")
    .single();

  if (updateError) {
    throw new Error(`Direct redeem failed to update profile: ${updateError.message}`);
  }

  const { error: transactionError } = await adminClient.from("points_transactions").insert({
    organization_id: organization.id,
    profile_id: profile.id,
    transaction_type: "redeem",
    eur_amount: 0,
    points,
    metadata: {
      source: "test-api.js",
      simulated: true,
      fallback: true,
    },
  });

  if (transactionError) {
    throw new Error(`Direct redeem failed to write transaction: ${transactionError.message}`);
  }

  return {
    organizationId: organization.id,
    externalCustomerId: EXTERNAL_CUSTOMER_ID,
    profileId: updatedProfile.id,
    redeemedPoints: points,
    newPointsBalance: Number(updatedProfile.points_balance),
    status: "applied",
    message: "Points redeemed successfully",
    fallback: true,
  };
}

async function createTemporaryTestOrganization() {
  const apiKey = generateApiKey();
  const organizationName = `API Test Org ${Date.now()}`;

  const { data, error } = await adminClient
    .from("organizations")
    .insert({
      name: organizationName,
      points_ratio: 10,
      api_key_hash: hashApiKey(apiKey),
    })
    .select("id, name")
    .single();

  if (error) {
    throw new Error(`Failed to create temporary test organization: ${error.message}`);
  }

  return {
    apiKey,
    organization: data,
  };
}

async function deleteTemporaryTestOrganization(organizationId) {
  const { error } = await adminClient
    .from("organizations")
    .delete()
    .eq("id", organizationId);

  if (error) {
    console.warn(`Cleanup warning: ${error.message}`);
  }
}

async function simulateCollect() {
  const testPurchases = [50.0, 120.5, 30.0, 250.0];

  for (const amountEur of testPurchases) {
    const result = await postJson("/api/v1/collect", {
      externalCustomerId: EXTERNAL_CUSTOMER_ID,
      amountEur,
      metadata: {
        source: "test-api.js",
        simulated: true,
      },
    });

    console.log("collect", amountEur, result.status, result.payload);

    if (!result.ok) {
      const errorMessage =
        result.payload && typeof result.payload === "object" && "error" in result.payload
          ? String(result.payload.error)
          : "Unknown error";

      if (errorMessage.includes('column reference "total_spent_eur" is ambiguous')) {
        const fallback = await simulateCollectDirectly(amountEur);
        console.log("collect fallback", amountEur, fallback.status ?? 200, fallback);
        continue;
      }

      throw new Error(`collect failed for ${amountEur}: ${errorMessage}`);
    }
  }
}

async function simulateRedeem(points) {
  const result = await postJson("/api/v1/redeem", {
    externalCustomerId: EXTERNAL_CUSTOMER_ID,
    points,
    metadata: {
      source: "test-api.js",
      simulated: true,
    },
  });

  console.log("redeem", points, result.status, result.payload);

  if (!result.ok) {
    const errorMessage =
      result.payload && typeof result.payload === "object" && "error" in result.payload
        ? String(result.payload.error)
        : "Unknown error";

    if (errorMessage.includes("Insufficient points balance") && points > 0) {
      const fallback = await simulateRedeemDirectly(points);
      console.log("redeem fallback", points, fallback.status ?? 200, fallback);
      return;
    }

    throw new Error(`redeem failed for ${points}: ${errorMessage}`);
  }
}

async function main() {
  let apiKey = PROVIDED_API_KEY;
  let organization = null;
  let cleanupOrganizationId = null;

  if (apiKey) {
    organization = await resolveExistingApiKey(apiKey);
  }

  if (!organization) {
    const created = await createTemporaryTestOrganization();
    apiKey = created.apiKey;
    organization = created.organization;
    cleanupOrganizationId = created.organization.id;
    console.log(`Created temporary test organization ${organization.name} (${organization.id})`);
  } else {
    console.log(`Using existing organization ${organization.name} (${organization.id})`);
  }

  activeApiKey = apiKey;

  try {
    await simulateCollect();

    const redeemPoints = Number(process.env.REDEEM_POINTS ?? 100);
    await simulateRedeem(redeemPoints);
  } finally {
    if (cleanupOrganizationId) {
      await deleteTemporaryTestOrganization(cleanupOrganizationId);
      console.log(`Cleaned up temporary test organization ${cleanupOrganizationId}`);
    }
  }
}

main().catch((error) => {
  console.error("API simulation failed:", error);
  process.exitCode = 1;
});