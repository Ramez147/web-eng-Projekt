process.env.NEXT_PUBLIC_SUPABASE_URL = "https://odjdwkuawxkntbuwaqmx.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "PASTE_SERVICE_ROLE_KEY_KAMU";
process.env.TEST_ORG_ID = "123e4567-e89b-12d3-a456-426614174000"; 

import { describe, it, expect } from "vitest";
import { generateApiKey } from "./actions";

describe("generateApiKey Integrationstest", () => {

  it("sollte Fehler werfen bei ungültiger UUID", async () => {
    await expect(generateApiKey("keine-uuid")).rejects.toThrow();
  });

  it("sollte Fehler werfen wenn Organisation nicht existiert", async () => {
    const randomUuid = "00000000-0000-0000-0000-000000000000";
    await expect(generateApiKey(randomUuid)).rejects.toThrow();
  });

});