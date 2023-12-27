const { Router } = require("express")
const router = Router();
const RoleRouter = require("./routes/role.router")

router.use("/role",RoleRouter)

module.exports = router