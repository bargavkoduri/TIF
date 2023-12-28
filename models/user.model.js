const mongoose = require("mongoose");
const { generateId } = require("../utils/helper");

const userSchema = new mongoose.Schema(
  {
    _id: String,
    name: {
      type: String,
      default: null,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
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

userSchema.pre("save", function (next) {
  if (this.isNew) {
    this._id = generateId();
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
