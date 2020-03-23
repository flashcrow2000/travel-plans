const Trip = require("../models/tripModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const { roles } = require("../roles");

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route"
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

exports.validateAction = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (user.role !== "admin" && user._id.toString() !== req.params.userId) {
      return res.status(401).json({
        error:
          "You don't have enough permission to perform this action (non-valid)"
      });
    }
    const trip = await Trip.findOne({ _id: req.params.tripId });
    if (!trip)
      return res.status(404).json({
        error: "Trip not found"
      });
    if (trip.owner !== user._id.toString() && user.role !== "admin")
      return res.status(401).json({
        error:
          "You don't have enough permission to perform this action (not resource owner)"
      });
    next();
  } catch (error) {
    next(error);
  }
};

exports.getAllTripsForUser = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    console.log(user.role);
    if (user.role !== "admin" && user._id.toString() !== req.params.userId) {
      return res.status(401).json({
        error: "You don't have enough permission to perform this action"
      });
    }
    const trips = await Trip.find({
      owner: mongoose.Types.ObjectId(req.params.userId)
    });
    res.json({
      trips,
      message: "Trips fetched succesfully"
    });
  } catch (error) {
    next(error);
  }
};

exports.addTripForUser = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (user.role !== "admin" && user._id.toString() !== req.params.userId) {
      return res.status(401).json({
        error: "You don't have enough permission to perform this action"
      });
    }
    const { destination, startDate, endDate, comment } = req.body;
    console.log(req.params.userId);
    const newTrip = new Trip({
      destination,
      startDate,
      endDate: endDate || null,
      comment,
      owner: req.params.userId
    });
    await newTrip.save();
    res.json({
      message: "Trip added successfully"
    });
  } catch (error) {
    next(error);
  }
};

exports.getTripForUser = async (req, res, next) => {
  try {
    const trips = await Trip.findOne({ _id: req.params.tripId });
    res.json({
      trips,
      message: "Trip retrieved successfully"
    });
  } catch (error) {
    next(error);
  }
};

exports.editTripForUser = async (req, res, next) => {
  try {
    const updatePaylod = { ...req.body };
    await Trip.findByIdAndUpdate(req.params.tripId, { $set: updatePaylod });
    const trip = await Trip.findOne({ _id: req.params.tripId });
    res.json({
      trip,
      message: "Trip updated successfully"
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTripForUser = async (req, res, next) => {
  try {
    await Trip.findByIdAndDelete(req.params.tripId);
    const trip = await Trip.findOne({ _id: req.params.tripId });
    if (!trip) {
      res.json({
        trip,
        message: "Trip removed successfully"
      });
    } else {
      return res.status(500).json({
        error: "Error removing trip"
      });
    }
  } catch (error) {
    next(error);
  }
};
