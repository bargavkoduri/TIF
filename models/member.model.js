const mongoose = require("mongoose");
const { generateId } = require("../utils/helper");

const memberSchema = new mongoose.Schema(
  {
    _id: String,
    community: {
      type: String,
      ref: "Community",
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      ref: "Role",
      required: true,
    },
  },
  {
    timestamps: true,
    _id: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.created_at = ret.createdAt;
        ret.updated_at = ret.updatedAt;
        delete ret.__v;
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

memberSchema.pre("save", function (next) {
  if (this.isNew) {
    this._id = generateId();
  }
  next();
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
