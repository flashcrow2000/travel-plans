describe("Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should show the login form", () => {
    cy.get("h1.text-xs-center").should("have.text", "Sign In");
    cy.get("ul")
      .children()
      .should("have.length", 2);
    cy.get("form > :nth-child(1)")
      .children()
      .should("have.length", 3);
  });

  it("should fail login", () => {
    const fakeUser = "fake@fake.com";
    const fakePassword = `fakepwd${parseInt(Math.random() * 42)}`;
    cy.get(":nth-child(1) > .form-control").type(fakeUser);
    cy.get(":nth-child(2) > .form-control").type(fakePassword);
    cy.get(".btn").click();
    cy.get("h5").should("be.visible");
  });
});
