const Validator = require("validatorjs");
const {role} = require("./validations.rules.json")

exports.roleValidator = (req,res,next) => {
    let validation = new Validator(req.body,role)
    if(validation.passes()){
        next()
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
        })
    }
}