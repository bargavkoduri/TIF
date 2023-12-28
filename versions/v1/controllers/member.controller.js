const Member = require("../../../models/member.model");
const User = require("../../../models/user.model");
const Community = require("../../../models/community.model");
const Role = require("../../../models/role.model");

exports.createMemeber = async (req, res) => {
  try {
    const community = await Community.findById(req.body.community);
    if (!community) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "community",
            message: "Community not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }
    if (community.owner !== req.user.id) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });
    }
    const role = await Role.findById(req.body.role);
    if (!role) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "role",
            message: "Role not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "user",
            message: "User not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }
    const member = await Member.findOne({
      community: req.body.community,
      user: req.body.user,
    });
    if (member) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "User is already added in the community.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }
    let newMember = new Member({
      community: req.body.community,
      role: req.body.role,
      user: req.body.user,
    });
    newMember = await newMember.save();
    res.status(200).json({
      status: true,
      content: {
        data: newMember,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "false",
    });
  }
};

exports.deleteMemeber = async (req, res) => {
  try {
    const { id } = req.params;
    let member = await Member.findById(id);
    if (!member) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "Member not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }
    let {role:userRole} = await Member.findOne({
        community: member.community,
        user: req.user.id
    }) 
    .populate({
        path: "role",
        select: "name"
    })
    if ( userRole.name !== "Community Admin" && userRole.name !== "Community Moderator"){
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You are not authorized to perform this action.",
              code: "NOT_ALLOWED_ACCESS",
            },
          ],
        });
    }
    await Member.findByIdAndDelete(id)  
    res.status(200).json({
        status: true,
        content: {
            data: member
        }
    })
  } catch (err) {
    res.status(500).json({
      status: "false",
    });
  }
};
