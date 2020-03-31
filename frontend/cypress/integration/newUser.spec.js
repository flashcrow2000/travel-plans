describe("Create user, add trip, delete user", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have a clickable button if passwords match", () => {
    cy.get(":nth-child(2) > .nav-link").click();
    const fakeUser = "fake@fake.com";
    const fakePassword1 = `fakepwd`;
    cy.get(":nth-child(1) > .form-control").type(fakeUser);
    cy.get(":nth-child(2) > .form-control").type(fakePassword1);
    cy.get(":nth-child(3) > .form-control").type(fakePassword1);
    cy.get(".btn").should("be.enabled");
    cy.get(".btn").click();
    cy.wait(500);
    cy.get("h1.text-xs-center").should("have.text", "Sign In");
  });

  it("should login with new account and add a trip", () => {
    const fakeUser = "fake@fake.com";
    const fakePassword = `fakepwd`;
    const fakeDestination = "fakeDestination";
    const fakeComment = "comment";
    const fakeStartDate = "04/16/2021";
    const fakeEndDate = "04/29/2021";
    cy.get(":nth-child(1) > .form-control").type(fakeUser);
    cy.get(":nth-child(2) > .form-control").type(fakePassword);
    cy.get(".btn").click();
    cy.get(".styles_header__3_Irl > h2").should(
      "have.text",
      "Where do you want to go next?"
    );
    cy.get(".au-btn").click();
    cy.get("#startDate")
      .clear()
      .type(fakeStartDate);
    cy.get("#endDate")
      .clear()
      .type(fakeEndDate);
    cy.get(":nth-child(1) > .form-control").type(fakeDestination);
    cy.get(":nth-child(2) > .form-control").type(fakeComment);
    cy.get(".btn").click();
    cy.get(".title-5").should("be.visible");
    cy.get('[data-title="Destination"]').should("have.text", fakeDestination);
  });

  it("should delete own account", () => {
    const fakeUser = "fake@fake.com";
    const fakePassword = `fakepwd`;
    cy.get(":nth-child(1) > .form-control").type(fakeUser);
    cy.get(":nth-child(2) > .form-control").type(fakePassword);
    cy.get(".btn").click();
    cy.get(".styles_header__3_Irl > h2").should(
      "have.text",
      "Where do you want to go next?"
    );
    cy.get(":nth-child(2) > .nav-link").click();
    cy.get(".btn-danger").click();
    cy.get(".modal-footer > .btn-danger").click();
  });
});
