const { Router } = require("express");
const router = Router();
const validationMiddleware = require("../../../validations/middlewares")
const RoleController = require("../controllers/role.controller")


router.post("",validationMiddleware.roleValidator,RoleController.createRole)
router.get("",RoleController.getRoles)

module.exports = router