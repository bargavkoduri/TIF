const Community = require("../../../models/community.model");
const Member = require("../../../models/member.model");
const Role = require("../../../models/role.model");
const { generateUniqueSlug } = require("../../../utils/helper");
const { mongoose } = require("../../../utils/db");

exports.createCommunity = async (req, res) => {
  // starting transaction
  const session = await mongoose.startSession();
  session.startTransaction({
    readPreference: "primary",
    readConcern: { level: "snapshot" },
  });
  const opts = { session };
  try {
    // creating community
    const count = await Community.countDocuments();
    let newCommunity = new Community({
      name: req.body.name,
      slug: generateUniqueSlug(count, req.body.name),
      owner: req.user.id,
    });
    newCommunity = (await newCommunity.save(opts)).toJSON();

    // creating member
    const adminRole = (
      await Role.findOne({ name: "Community Admin" })
    ).toJSON();
    const newMember = new Member({
      community: newCommunity.id,
      user: req.user.id,
      role: adminRole.id,
    });
    await newMember.save(opts);

    //commiting transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: true,
      content: {
        data: newCommunity,
      },
    });
  } catch (err) {
    //  error abort the transaction
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: "false",
    });
  }
};

// Returns communities
exports.getCommunities = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    const total = await Community.countDocuments();
    let communities = await Community.find({})
      .sort({ name: 1 })
      .skip((page - 1) * 10)
      .limit(10)
      .populate({
        path: "owner",
        select: "name",
      });
    res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: Math.ceil(total / 10),
          page: page,
        },
        data: communities,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "false",
    });
  }
};

// Returns community members
exports.getCommunity = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    const { id } = req.params;
    const { id: communityId } = await Community.findOne({ slug: id });
    const total = await Member.countDocuments({ community: communityId });
    let members = await Member.find({ community: communityId })
      .sort({ createdAt: 1 })
      .skip((page - 1) * 10)
      .limit(10)
      .populate([
        {
          path: "user",
          select: "name",
        },
        {
          path: "role",
          select: "name",
        },
      ]);
    res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: Math.ceil(total / 10),
          page: page,
        },
        data: members,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "false",
    });
  }
};

// Returns communities with owner being the current user
exports.getOwnerCommunities = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let total = await Community.countDocuments({ owner: req.user.id });
    let communities = await Community.find({ owner: req.user.id })
      .sort({ name: 1 })
      .skip((page - 1) * 10)
      .limit(10);
    res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: Math.ceil(total / 10),
          page: page,
        },
        data: communities,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "false",
    });
  }
};

// Returns communities current user is present in
exports.getMemberCommunities = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let { id: adminId } = await Role.findOne({ name: "Community Admin" });
    const total = await Member.countDocuments({
      user: req.user.id,
      role: { $ne: adminId },
    });
    let communities = await Member.find(
      { user: req.user.id, role: { $ne: adminId } },
      { community: 1, _id: 0 }
    )
      .sort({ createdAt: 1 })
      .skip((page - 1) * 10)
      .limit(10)
      .populate({
        path: "community",
        populate: {
          path: "owner",
          select: "name",
        },
      });
    let arr = communities.map((community) => {
      let obj = community.community.toJSON();
      return obj;
    });
    res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: Math.ceil(total / 10),
          page: page,
        },
        data: arr,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "false",
    });
  }
};
