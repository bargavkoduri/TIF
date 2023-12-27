const mongoose = require("mongoose");
const generateId = require("../utils/snowflake")

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
        delete ret._id;
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

const User = mongoose.model("User",userSchema)

module.exports = User