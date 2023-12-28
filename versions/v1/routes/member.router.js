const { Router } = require("express");
const router = Router();
const MemberController = require("../controllers/member.controller");
const { checkValidToken } = require("../../.././utils/jwt");
const ValidationMiddleware = require("../../../validations/middlewares");

router.post("/",checkValidToken,ValidationMiddleware.memberValidator,MemberController.createMemeber);
router.delete("/:id", checkValidToken, MemberController.deleteMemeber);

module.exports = router;