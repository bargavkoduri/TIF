const User = require("../../../models/user.model");
const { hashPassword, comparePassword } = require("../../../utils/bcrypt");
const { generateToken } = require("../../../utils/jwt");

// signup
exports.createUser = async (req, res) => {
  try {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword(req.body.password),
    });
    newUser = (await newUser.save()).toJSON();
    delete newUser.password;
    res.status(200).json({
      status: true,
      content: {
        data: newUser,
        meta: {
          access_token: generateToken({ id: newUser.id }),
        },
      },
    });
  } catch (err) {
    // Duplicate error
    if (err.code === 11000) {
      res.status(400).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "User with this email address already exists.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    } else {
      res.sendStatus(500);
    }
  }
};

// signIn
exports.loginUser = async (req, res) => {
  try {
    let user = (await User.findOne({ email: req.body.email })).toJSON();
    if (!user) {
      res.status(400).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "No user found with email provided",
            code: "INVALID_CREDENTIALS",
          },
        ],
      });
    } else if (comparePassword(req.body.password, user.password)) {
      delete user.password;
      res.status(200).json({
        status: true,
        content: {
          data: user,
          meta: {
            access_token: generateToken({ id: user.id }),
          },
        },
      });
    } else {
      res.status(400).json({
        status: false,
        errors: [
          {
            param: "password",
            message: "The credentials you provided are invalid.",
            code: "INVALID_CREDENTIALS",
          },
        ],
      });
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

// user details
exports.userDetails = async (req, res) => {
  try {
    let user = (await User.findById(req.user.id)).toJSON();
    if (!user) {
      res.status(200).json({
        status : false,
        errors : {
            message : "No user found with this token"
        }
      });
    }
    delete user.password;
    res.status(200).json({
      status: true,
      content: {
        data: user,
      },
    });
  } catch (err) {
    res.sendStatus(500)
  }
};
