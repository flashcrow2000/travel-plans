const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tripController = require("../controllers/tripController");

// user routes
router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get(
  "/users/:userId",
  userController.allowIfLoggedin,
  userController.getUser
);

router.get(
  "/users",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  userController.getUsers
);
// update own profile
router.put(
  "/users/:userId",
  userController.allowIfLoggedin,
  userController.updateUser
);

router.delete(
  "/users/:userId",
  userController.allowIfLoggedin,
  userController.deleteUser
);

// trips routes
router.get(
  "/users/:userId/trips",
  tripController.allowIfLoggedin,
  tripController.getAllTripsForUser
);

router.post(
  "/users/:userId/trips",
  tripController.allowIfLoggedin,
  tripController.addTripForUser
);

router.get(
  "/users/:userId/trips/:tripId",
  tripController.allowIfLoggedin,
  tripController.validateAction,
  tripController.getTripForUser
);

router.put(
  "/users/:userId/trips/:tripId",
  tripController.allowIfLoggedin,
  tripController.validateAction,
  tripController.editTripForUser
);

router.delete(
  "/users/:userId/trips/:tripId",
  tripController.allowIfLoggedin,
  tripController.validateAction,
  tripController.deleteTripForUser
);

module.exports = router;
