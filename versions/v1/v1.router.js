const { Router } = require("express")
const router = Router();
const RoleRouter = require("./routes/role.router")
const AuthRouter = require("./routes/auth.router")
const CommunityRouter = require("./routes/community.router")
const MemberRouter = require("./routes/member.router")

router.use("/role",RoleRouter)
router.use("/auth",AuthRouter)
router.use("/community",CommunityRouter)
router.use("/member",MemberRouter)

module.exports = router