describe("Create supervisor, add user, delete user, delete supervisor", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("create a supervisor, log in, create user, delete user, delete supervisor", () => {
    cy.visit("/signup?advanced");
    cy.get("#roleSelect").should("be.visible");
    const fakeSuper = "fakeSuper@fake.com";
    const fakeUser = "fakeUser@fake.com";
    const fakePassword1 = `fakepwd`;
    cy.get("#roleSelect").select("supervisor");
    cy.get(":nth-child(1) > .form-control").type(fakeSuper);
    cy.get(":nth-child(2) > .form-control").type(fakePassword1);
    cy.get(":nth-child(3) > .form-control").type(fakePassword1);
    cy.get(".btn").should("be.enabled");
    cy.get(".btn").click();
    cy.wait(500);
    cy.get("h1.text-xs-center").should("have.text", "Sign In");
    cy.get(":nth-child(1) > .form-control").type(fakeSuper);
    cy.get(":nth-child(2) > .form-control").type(fakePassword1);
    cy.get(".btn").click();
    cy.get(".title-5").should("have.text", "registered users");
    cy.get(".btn").click();
    cy.get(":nth-child(1) > .form-control").type(fakeUser);
    cy.get(":nth-child(2) > .form-control").type(fakePassword1);
    cy.get(":nth-child(3) > .form-control").type(fakePassword1);
    cy.get(".btn").should("be.enabled");
    cy.get(".btn").click();
    cy.wait(500);
    cy.get('[data-title="Email"]')
      .last()
      .should("have.text", fakeUser);
    cy.get(".table-data-feature > .item > .MuiSvgIcon-root")
      .last()
      .click();
    cy.get(".btn-danger").click();
    cy.get(".modal-footer > .btn-danger").click();
    // delete supervisor
    cy.get(":nth-child(2) > .nav-link").click();
    cy.get(".btn-danger").click();
    cy.get(".modal-footer > .btn-danger").click();
  });
});
