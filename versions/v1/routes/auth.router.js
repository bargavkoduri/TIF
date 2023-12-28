const { Router } = require("express");
const router = Router();
const AuthController = require("../controllers/auth.controller")
const validationMiddleware = require("../../../validations/middlewares");
const {checkValidToken} = require("../../../utils/jwt")

router.post("/signup",validationMiddleware.signupValidator,AuthController.createUser)
router.post("/signin",validationMiddleware.signinValidator,AuthController.loginUser)
router.get("/me",checkValidToken,AuthController.userDetails)

module.exports = router