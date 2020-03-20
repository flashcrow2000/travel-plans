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

exports.getAllTripsForUser = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (user.role === "basic" && user._id.toString() !== req.params.userId) {
      return res.status(401).json({
        error: "You don't have enough permission to perform this action"
      });
    }
    const trips = await Trip.find({ owner: mongoose.Types.ObjectId(user._id) });
    res.json({
      data: trips,
      message: "Trips fetched succesfully"
    });
  } catch (error) {
    next(error);
  }
};

exports.addTripForUser = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (user.role === "basic" && user._id !== req.params.userId) {
      return res.status(401).json({
        error: "You don't have enough permission to perform this action"
      });
    }
    const { destination, startDate, endDate, comment } = req.body;
    const newTrip = new Trip({
      destination,
      startDate,
      endDate: endDate || null,
      comment,
      owner: user._id
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
    const user = res.locals.loggedInUser;
    if (user.role === "basic" && user._id.toString() !== req.params.userId) {
      return res.status(401).json({
        error:
          "You don't have enough permission to perform this action (not logged in)"
      });
    }
    const trip = await Trip.findOne({ _id: req.params.tripId });
    if (!trip)
      return res.status(404).json({
        error: "Trip not found"
      });
    if (trip.owner !== user._id.toString())
      return res.status(401).json({
        error:
          "You don't have enough permission to perform this action (not resource owner)"
      });
    res.json({
      data: trip,
      message: "Trip retrieved successfully"
    });
  } catch (error) {
    next(error);
  }
};
