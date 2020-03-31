describe("Signup", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(":nth-child(2) > .nav-link").click();
  });

  it("should show the signup form", () => {
    cy.get("h1.text-xs-center").should("have.text", "Sign Up");
    cy.get("ul")
      .children()
      .should("have.length", 2);
    cy.get("form > :nth-child(1)")
      .children()
      .should("have.length", 4);
  });

  it("should have a disabled button if passwords don't match", () => {
    const fakeUser = "fake@fake.com";
    const fakePassword1 = `fakepwd${parseInt(Math.random() * 42)}`;
    const fakePassword2 = `fakepwd${parseInt(Math.random() * 42)}`;
    cy.get(":nth-child(1) > .form-control").type(fakeUser);
    cy.get(":nth-child(2) > .form-control").type(fakePassword1);
    cy.get(":nth-child(3) > .form-control").type(fakePassword2);
    cy.get(".btn").should("be.disabled");
  });

  it("should have a clickable button if passwords match", () => {
    const fakeUser = "fake@fake.com";
    const fakePassword1 = `fakepwd${parseInt(Math.random() * 42)}`;
    cy.get(":nth-child(1) > .form-control").type(fakeUser);
    cy.get(":nth-child(2) > .form-control").type(fakePassword1);
    cy.get(":nth-child(3) > .form-control").type(fakePassword1);
    cy.get(".btn").should("be.enabled");
  });
});
