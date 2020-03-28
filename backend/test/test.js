process.env.NODE_ENV = "TEST";
var expect = require("chai").expect;
var app = require("../server/server");
var request = require("supertest");

const adminCredentials = {
  email: "admin1@test.com",
  password: "admin1@test.com"
};
const supervisorCredentials = {
  email: "supervisor1@test.com",
  password: "supervisor1@test.com"
};
const user1Credentials = {
  email: "user1@test.com",
  password: "user1@test.com"
};
const user2Credentials = {
  email: "user2@test.com",
  password: "user2@test.com"
};
const tempPwd = "tempPwd";
let adminUser = {};
let supervisorUser = {};
let basicUser1 = {};
let basicUser2 = {};

const searchParams = params =>
  Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");

//Login test accounts
var authenticatedEndpoint = request.agent(app);
before(function(done) {
  this.timeout(5000);
  authenticatedEndpoint
    .post("/login")
    .send(searchParams(adminCredentials))
    .end(function(err, response) {
      adminUser.accessToken = response.body.accessToken;
      adminUser.id = response.body.data.id;
      console.log("admin done");
      expect(response.statusCode).to.equal(200);
    });
  authenticatedEndpoint
    .post("/login")
    .send(searchParams(supervisorCredentials))
    .end(function(err, response) {
      supervisorUser.accessToken = response.body.accessToken;
      supervisorUser.id = response.body.data.id;
      console.log("supervisor done");
      expect(response.statusCode).to.equal(200);
    });
  authenticatedEndpoint
    .post("/login")
    .send(searchParams(user1Credentials))
    .end(function(err, response) {
      basicUser1.accessToken = response.body.accessToken;
      basicUser1.id = response.body.data.id;
      console.log("user1 done");
      expect(response.statusCode).to.equal(200);
    });
  authenticatedEndpoint
    .post("/login")
    .send(searchParams(user2Credentials))
    .end(function(err, response) {
      basicUser2.accessToken = response.body.accessToken;
      basicUser2.id = response.body.data.id;
      console.log("user2 done");
      expect(response.statusCode).to.equal(200);
    });
  setTimeout(() => {
    done();
  }, 3000);
});

describe("GET /users", function(done) {
  it("should return users if logged in as admin", function(done) {
    authenticatedEndpoint
      .get("/users")
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.body.users.length).to.be.greaterThan(0);
        done();
      });
  });
  it("should return users if logged in as supervisor", function(done) {
    authenticatedEndpoint
      .get("/users")
      .set("x-access-token", supervisorUser.accessToken)
      .end(function(err, response) {
        expect(response.body.users.length).to.be.greaterThan(0);
        done();
      });
  });
  it("should not return users if logged in as user", function(done) {
    authenticatedEndpoint
      .get("/users")
      .set("x-access-token", basicUser1.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(401);
        done();
      });
  });
});

describe("Edit profile", function(done) {
  it("should change own password if logged in as basic user", function(done) {
    authenticatedEndpoint
      .put(`/users/${basicUser2.id}`)
      .send(
        searchParams({
          oldPassword: user2Credentials.password,
          newPassword: tempPwd
        })
      )
      .set("x-access-token", basicUser2.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should login with the changed password", function(done) {
    authenticatedEndpoint
      .post("/login")
      .send(searchParams({ password: tempPwd, email: user2Credentials.email }))
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should change own password back to the initial one", function(done) {
    authenticatedEndpoint
      .put(`/users/${basicUser2.id}`)
      .send(
        searchParams({
          oldPassword: tempPwd,
          newPassword: user2Credentials.password
        })
      )
      .set("x-access-token", basicUser2.accessToken)
      .end(function(err, response) {
        console.log("status code:", response.statusCode);
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
});

// should not be able to change another profile if logged in as user
// should be able to change own profile when logged in as admin
// should be able to change own profile when logged in as supervisor
// should be able to change another profile when logged in as admin
// should be able to change another profile when logged in as supervisor
// should be able to add a new user when logged in as supervisor
// should be able to add a new user when logged in as admin
// should be able to delete a user when logged in as supervisor (should remove trips as well)
// should be able to delete a user when logged in as admin (should remove trips as well)

// should be able to add a trip as a basic user
// should be able to read the owned trips as a basic user
// should be able to edit an owned trip as a basic user
// should be able to delete an owned trip as a basic user
// should not be able to add a trip for another user when logged in as basic user
// should not be able to view a trip for another user when logged in as basic user
// should not be able to edit a trip for another user when logged in as basic user
// should not be able to delete a trip for another user when logged in as basic user
// should not be able to add a trip for another user when logged in as supervisor user
// should not be able to view a trip for another user when logged in as supervisor user
// should not be able to edit a trip for another user when logged in as supervisor user
// should not be able to delete a trip for another user when logged in as supervisor user

// should be able to add a trip for a user as admin
// should be able to edit a trip for a user as admin
// should be able to delete a trip for a user as admin
