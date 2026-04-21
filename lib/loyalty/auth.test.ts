import * as auth from "./auth";

describe("auth module", () => {
  it("should export getOrganizationFromApiKey", () => {
    expect(typeof auth.getOrganizationFromApiKey).toBe("function");
  });
  it("should export assertOrganizationApiKey", () => {
    expect(typeof auth.assertOrganizationApiKey).toBe("function");
  });
  // Tambahkan test lebih detail sesuai logic auth.ts Anda
});
