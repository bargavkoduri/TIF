const Validator = require("validatorjs");
const {
  role,
  signup,
  signin,
  community,
  member,
} = require("./validations.rules.json");

const populateArr = (errors) => {
  let errorsArr = [];
  for (error in errors) {
    let obj = {
      param: error,
      message: errors[error][0],
      code: "INVALID_INPUT",
    };
    errorsArr.push(obj);
  }
  return errorsArr;
};

exports.roleValidator = (req, res, next) => {
  let validation = new Validator(req.body, role);
  if (validation.passes()) {
    next();
  } else {
    res.status(400).json({
      status: false,
      errors: [
        {
          param: "name",
          message: "Name should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }
};

// signup validation
exports.signupValidator = (req, res, next) => {
  let validation = new Validator(req.body, signup);
  if (validation.passes()) {
    next();
  } else {
    let { errors } = validation.errors;
    errors = populateArr(errors);
    res.status(400).json({
      status: false,
      errors,
    });
  }
};

// signin validator
exports.signinValidator = (req, res, next) => {
  let validation = new Validator(req.body, signin);
  if (validation.passes()) {
    next();
  } else {
    let { errors } = validation.errors;
    errors = populateArr(errors);
    res.status(400).json({
      status: false,
      errors,
    });
  }
};

// community validator
exports.communityValidator = (req, res, next) => {
  let validation = new Validator(req.body, community);
  if (validation.passes()) {
    next();
  } else {
    res.status(400).json({
      status: false,
      errors: [
        {
          param: "name",
          message: "Name should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }
};

// member validator
exports.memberValidator = (req, res, next) => {
  let validation = new Validator(req.body, member);
  if (validation.passes()) {
    next();
  } else {
    let { errors } = validation.errors;
    errors = populateArr(errors);
    res.status(400).json({
      status: false,
      errors,
    });
  }
};
