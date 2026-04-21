import * as userMembership from "./user-membership";

describe("user-membership module", () => {
  it("should export getCurrentMembershipContext", () => {
    expect(typeof userMembership.getCurrentMembershipContext).toBe("function");
  });
  it("should export getSignedInUser", () => {
    expect(typeof userMembership.getSignedInUser).toBe("function");
  });
  it("should export assignAdminMembership", () => {
    expect(typeof userMembership.assignAdminMembership).toBe("function");
  });
  // Tambahkan test lebih detail sesuai logic user-membership.ts Anda
});
