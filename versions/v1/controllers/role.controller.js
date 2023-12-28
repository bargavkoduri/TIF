const Role = require("../../../models/role.model");

exports.createRole = async (req, res) => {
  try {
    let newRole = new Role(req.body);
    newRole = await newRole.save();
    res.status(200).json({
      status: true,
      content: {
        data: newRole,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        status: false,
        errors: [
          {
            param: "name",
            message: "Role with this name already exists.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    } else {
      res.status(500).json({
        status: "false",
      });
    }
  }
};

exports.getRoles = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    const total = await Role.countDocuments();
    let roles = await Role.find({}, { __v: 0 })
      .sort({ names: 1 })
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
        data: roles,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "false",
    });
  }
};
