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
      expect(response.statusCode).to.equal(200);
    });
  authenticatedEndpoint
    .post("/login")
    .send(searchParams(supervisorCredentials))
    .end(function(err, response) {
      supervisorUser.accessToken = response.body.accessToken;
      supervisorUser.id = response.body.data.id;
      expect(response.statusCode).to.equal(200);
    });
  authenticatedEndpoint
    .post("/login")
    .send(searchParams(user1Credentials))
    .end(function(err, response) {
      basicUser1.accessToken = response.body.accessToken;
      basicUser1.id = response.body.data.id;
      expect(response.statusCode).to.equal(200);
    });
  authenticatedEndpoint
    .post("/login")
    .send(searchParams(user2Credentials))
    .end(function(err, response) {
      basicUser2.accessToken = response.body.accessToken;
      basicUser2.id = response.body.data.id;
      expect(response.statusCode).to.equal(200);
    });
  setTimeout(() => {
    done();
  }, 3000);
});

describe("login", function(done) {
  it("should not login if wrong password", function(done) {
    authenticatedEndpoint
      .post("/login")
      .send(
        searchParams({
          email: user1Credentials.email,
          password: "not-the-actual-password"
        })
      )
      .end(function(err, response) {
        expect(response.statusCode).to.equal(500);
        done();
      });
  });
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

describe("Edit profile by basic user", function(done) {
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

  it("should not change own password if old password doesn't match", function(done) {
    authenticatedEndpoint
      .put(`/users/${basicUser2.id}`)
      .send(
        searchParams({
          oldPassword: `${tempPwd}-fake`,
          newPassword: user2Credentials.password
        })
      )
      .set("x-access-token", basicUser2.accessToken)
      .end(function(err, response) {
        console.log("status code:", response.statusCode);
        expect(response.statusCode).to.equal(401);
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
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should not change own password if basic user and not own profile", function(done) {
    authenticatedEndpoint
      .put(`/users/${basicUser2.id}`)
      .send(
        searchParams({
          oldPassword: user2Credentials.password,
          newPassword: tempPwd
        })
      )
      .set("x-access-token", basicUser1.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(401);
        done();
      });
  });
});

describe("Edit profile by supervisor user", function(done) {
  it("should change own password if logged in as supervisor user", function(done) {
    authenticatedEndpoint
      .put(`/users/${supervisorUser.id}`)
      .send(
        searchParams({
          oldPassword: supervisorCredentials.password,
          newPassword: tempPwd
        })
      )
      .set("x-access-token", supervisorUser.accessToken)
      .end(function(err, response) {
        console.log(err);
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should login with the changed password", function(done) {
    authenticatedEndpoint
      .post("/login")
      .send(
        searchParams({ password: tempPwd, email: supervisorCredentials.email })
      )
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should change own password back to the initial one", function(done) {
    authenticatedEndpoint
      .put(`/users/${supervisorUser.id}`)
      .send(
        searchParams({
          oldPassword: tempPwd,
          newPassword: supervisorCredentials.password
        })
      )
      .set("x-access-token", supervisorUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should change basic user's password if logged in as supervisor user", function(done) {
    authenticatedEndpoint
      .put(`/users/${basicUser1.id}`)
      .send(
        searchParams({
          password: tempPwd
        })
      )
      .set("x-access-token", supervisorUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should login as basic user with the changed password", function(done) {
    authenticatedEndpoint
      .post("/login")
      .send(searchParams({ password: tempPwd, email: user1Credentials.email }))
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should change basic user's password back to the initial one if logged in as supervisor user", function(done) {
    authenticatedEndpoint
      .put(`/users/${basicUser1.id}`)
      .send(
        searchParams({
          password: user1Credentials.password
        })
      )
      .set("x-access-token", supervisorUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
});

describe("Edit profile by admin user", function(done) {
  it("should change own password if logged in as admin user", function(done) {
    authenticatedEndpoint
      .put(`/users/${adminUser.id}`)
      .send(
        searchParams({
          oldPassword: adminCredentials.password,
          newPassword: tempPwd
        })
      )
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        console.log(err);
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should login with the changed password", function(done) {
    authenticatedEndpoint
      .post("/login")
      .send(searchParams({ password: tempPwd, email: adminCredentials.email }))
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should change own password back to the initial one", function(done) {
    authenticatedEndpoint
      .put(`/users/${adminUser.id}`)
      .send(
        searchParams({
          oldPassword: tempPwd,
          newPassword: adminCredentials.password
        })
      )
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should change basic user's password if logged in as admin user", function(done) {
    authenticatedEndpoint
      .put(`/users/${basicUser1.id}`)
      .send(
        searchParams({
          password: tempPwd
        })
      )
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should login as basic user with the changed password", function(done) {
    authenticatedEndpoint
      .post("/login")
      .send(searchParams({ password: tempPwd, email: user1Credentials.email }))
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should change basic user's password back to the initial one if logged in as supervisor user", function(done) {
    authenticatedEndpoint
      .put(`/users/${basicUser1.id}`)
      .send(
        searchParams({
          password: user1Credentials.password
        })
      )
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
});

describe("Add/remove user by supervisor", function(done) {
  let tempUser = { email: "temp@test.com", password: tempPwd, role: "basic" };
  it("should add new user if logged in as supervisor", function(done) {
    authenticatedEndpoint
      .post(`/signup`)
      .send(searchParams(tempUser))
      .set("x-access-token", supervisorUser.accessToken)
      .end(function(err, response) {
        console.log(err);
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should be able to login as temp user", function(done) {
    authenticatedEndpoint
      .post("/login")
      .send(searchParams({ password: tempPwd, email: tempUser.email }))
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        tempUser.id = response.body.data.id;
        done();
      });
  });

  it("should delete the temp user", function(done) {
    authenticatedEndpoint
      .delete(`/users/${tempUser.id}`)
      .set("x-access-token", supervisorUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should not be able to login as temp user", function(done) {
    authenticatedEndpoint
      .post("/login")
      .send(searchParams({ password: tempPwd, email: tempUser.email }))
      .end(function(err, response) {
        expect(response.statusCode).to.equal(500);
        done();
      });
  });
});

describe("Add/remove user by admin", function(done) {
  let tempUser = { email: "temp@test.com", password: tempPwd, role: "basic" };
  it("should add new user if logged in as supervisor", function(done) {
    authenticatedEndpoint
      .post(`/signup`)
      .send(searchParams(tempUser))
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        console.log(err);
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should be able to login as temp user", function(done) {
    authenticatedEndpoint
      .post("/login")
      .send(searchParams({ password: tempPwd, email: tempUser.email }))
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        tempUser.id = response.body.data.id;
        done();
      });
  });

  it("should delete the temp user", function(done) {
    authenticatedEndpoint
      .delete(`/users/${tempUser.id}`)
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should not be able to login as temp user", function(done) {
    authenticatedEndpoint
      .post("/login")
      .send(searchParams({ password: tempPwd, email: tempUser.email }))
      .end(function(err, response) {
        expect(response.statusCode).to.equal(500);
        done();
      });
  });
});

describe("Manage trips by basic user", function(done) {
  const tripData = {
    destination: "New York",
    startDate: "2020-06-12",
    endDate: "2020-06-28",
    comment: "The big apple!"
  };
  let tripId = "";

  it("should add new trip if logged in as basic user", function(done) {
    authenticatedEndpoint
      .post(`/users/${basicUser1.id}/trips`)
      .send(searchParams(tripData))
      .set("x-access-token", basicUser1.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should not add new trip for another user if logged in as basic user", function(done) {
    authenticatedEndpoint
      .post(`/users/${basicUser1.id}/trips`)
      .send(searchParams(tripData))
      .set("x-access-token", basicUser2.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(401);
        done();
      });
  });

  it("should fetch own trips if logged in as basic user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .get(`/users/${basicUser1.id}/trips`)
      .set("x-access-token", basicUser1.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        expect(response.body.trips.length).to.be.greaterThan(0);
        tripId = response.body.trips[0]._id;
        done();
      });
  });

  it("should not fetch another user's trips if logged in as basic user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .get(`/users/${basicUser1.id}/trips`)
      .set("x-access-token", basicUser2.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(401);
        done();
      });
  });

  it("should edit own trip if logged in as basic user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .put(`/users/${basicUser1.id}/trips/${tripId}`)
      .send(
        searchParams({
          destination: "Himalaya base camp"
        })
      )
      .set("x-access-token", basicUser1.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should not edit other user's trip if logged in as basic user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .put(`/users/${basicUser1.id}/trips/${tripId}`)
      .send(
        searchParams({
          destination: "Himalaya base camp"
        })
      )
      .set("x-access-token", basicUser2.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(401);
        done();
      });
  });

  it("should not delete other user's trip if logged in as basic user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .delete(`/users/${basicUser1.id}/trips/${tripId}`)
      .set("x-access-token", basicUser2.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(401);
        done();
      });
  });

  it("should delete own trip if logged in as basic user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .delete(`/users/${basicUser1.id}/trips/${tripId}`)
      .set("x-access-token", basicUser1.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
});

describe("Manage trips by supervisor user", function(done) {
  const tripData = {
    destination: "New York",
    startDate: "2020-06-12",
    endDate: "2020-06-28",
    comment: "The big apple!"
  };
  let tripId = "";

  it("should add new trip as basic user", function(done) {
    authenticatedEndpoint
      .post(`/users/${basicUser1.id}/trips`)
      .send(searchParams(tripData))
      .set("x-access-token", basicUser1.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        tripId = response.body.trip._id;
        done();
      });
  });

  it("should not fetch basic user trips if logged in as supervisor user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .get(`/users/${basicUser1.id}/trips`)
      .set("x-access-token", supervisorUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(401);
        done();
      });
  });

  it("should delete own trip as basic user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .delete(`/users/${basicUser1.id}/trips/${tripId}`)
      .set("x-access-token", basicUser1.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
});

describe("Manage trips by admin user", function(done) {
  const tripData = {
    destination: "New York",
    startDate: "2020-06-12",
    endDate: "2020-06-28",
    comment: "The big apple!"
  };
  let tripId = "";

  it("should add new trip as basic user", function(done) {
    authenticatedEndpoint
      .post(`/users/${basicUser1.id}/trips`)
      .send(searchParams(tripData))
      .set("x-access-token", basicUser1.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        tripId = response.body.trip._id;
        done();
      });
  });

  it("should fetch basic user trips if logged in as admin user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .get(`/users/${basicUser1.id}/trips`)
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        expect(response.body.trips.length).to.be.greaterThan(0);
        done();
      });
  });

  it("should edit basic user trips if logged in as admin user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .put(`/users/${basicUser1.id}/trips/${tripId}`)
      .send(
        searchParams({
          destination: "Himalaya base camp"
        })
      )
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should delete a basic user's trip if logged in as admin user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .delete(`/users/${basicUser1.id}/trips/${tripId}`)
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should add new trip for basic user if logged in as admin", function(done) {
    authenticatedEndpoint
      .post(`/users/${basicUser1.id}/trips`)
      .send(searchParams(tripData))
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        tripId = response.body.trip._id;
        done();
      });
  });

  it("should edit a trip added by admin", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .put(`/users/${basicUser1.id}/trips/${tripId}`)
      .send(
        searchParams({
          destination: "Himalaya base camp"
        })
      )
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it("should delete a basic user's trip if logged in as admin user", function(done) {
    ///users/5e77aacd887fd453e046e4a3/trips
    authenticatedEndpoint
      .delete(`/users/${basicUser1.id}/trips/${tripId}`)
      .set("x-access-token", adminUser.accessToken)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
});
