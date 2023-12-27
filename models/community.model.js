const mongoose = require("mongoose");
const generateId = require("../utils/snowflake");

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
        delete ret._id;
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