const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const tripController = require("../controllers/tripController");

const { roles } = require("../roles");

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

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

exports.signup = async (req, res, next) => {
  try {
    const { role, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user)
      return res.status(403).json({
        error: "Email already registered. Please login!"
      });
    console.log("Signup: Before hash");
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "basic"
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({
      data: newUser,
      message: "You have signed up successfully"
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Email does not exist"));
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error("Password is not correct"));
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    await User.findByIdAndUpdate(user._id, { accessToken });
    res.status(200).json({
      data: { email: user.email, role: user.role, id: user._id },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    users
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.status(200).json({
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    const updateUserId = req.params.userId;
    let updatePaylod = {};
    if (user._id.toString() === updateUserId) {
      if (req.body.newPassword && req.body.oldPassword) {
        const userBeforeUpdate = await User.findById(updateUserId);
        const validPassword = await validatePassword(
          req.body.oldPassword,
          userBeforeUpdate.password
        );
        if (!validPassword)
          return res.status(401).json({
            error: "Old password doesn't match"
          });
        const hashedPassword = await hashPassword(req.body.newPassword);
        updatePaylod = { password: hashedPassword };
      } else {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
    } else {
      if (user.role === "admin" || user.role === "supervisor") {
        updatePaylod = { ...req.body };
        if (req.body.password) {
          const hashedPassword = await hashPassword(req.body.password);
          updatePaylod.password = hashedPassword;
        }
      } else {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
    }

    await User.findByIdAndUpdate(updateUserId, { $set: updatePaylod });
    const updatedUser = await User.findById(updateUserId);
    if (!updatedUser) {
      return res.status(404).json({
        error: "User doesn't exist"
      });
    }
    res.status(200).json({
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    const deleteUserId = req.params.userId;
    if (
      user._id.toString() === deleteUserId ||
      user.role === "admin" ||
      user.role === "supervisor"
    ) {
      await User.findByIdAndDelete(deleteUserId);
      tripController.deleteAllUserTrips(deleteUserId);
      return res.status(200).json({
        data: null,
        message: "User has been deleted"
      });
    } else {
      return res.status(401).json({
        error: "You don't have enough permission to perform this action"
      });
    }
  } catch (error) {
    next(error);
  }
};
