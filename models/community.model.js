const mongoose = require("mongoose");
const {generateId} = require("../utils/helper");

const communitySchema = new mongoose.Schema(
  {
    _id: String,
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    owner: {
      type: String,
      ref: "User",
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

communitySchema.pre("save", function (next) {
  if (this.isNew) {
    this._id = generateId();
  }
  next();
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
