import * as db from "./db";

describe("db module", () => {
  it("should export getAdminSupabaseClient", () => {
    expect(typeof db.getAdminSupabaseClient).toBe("function");
  });
  // Tambahkan test lebih detail jika ada logic tambahan di db.ts
});
