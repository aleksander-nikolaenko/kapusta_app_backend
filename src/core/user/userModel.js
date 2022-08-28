const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Schema, model } = require('mongoose');

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, Number(process.env.HASH_POWER));
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createToken = function () {
  const payload = {
    _id: this._id,
  };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
  });
};

const User = model('user', userSchema);

module.exports = {
  User,
};
