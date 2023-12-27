const mongoose = require("mongoose");
const generateId = require("../utils/snowflake");

const roleSchema = new mongoose.Schema(
  {
    _id : String,
    name: {
      type: String,
      unique: true,
      required: true
    }
  },
  {
    timestamps: true,
    _id: false,
    toJSON: {
      transform(doc,ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
);

roleSchema.pre("save",function(next) {
  if (this.isNew) {
    this._id = generateId();
  }
  next();
});


const Role = mongoose.model("Role", roleSchema);

module.exports = Role;