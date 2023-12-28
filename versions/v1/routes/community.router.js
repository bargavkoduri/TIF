const { Router } = require("express");
const router = Router();
const validationMiddleware = require("../../../validations/middlewares");
const CommunityController = require("../controllers/community.controller")
const { checkValidToken } = require("../../../utils/jwt")

router.get("/",CommunityController.getCommunities)
router.post("/",checkValidToken,validationMiddleware.communityValidator,CommunityController.createCommunity)
router.get("/me/owner",checkValidToken,CommunityController.getOwnerCommunities)
router.get("/me/member",checkValidToken,CommunityController.getMemberCommunities)
router.get("/:id/members",CommunityController.getCommunity)

module.exports = router