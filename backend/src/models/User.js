import mongoose from "mongoose";
import bcrypt from "bcrypt";
import STATUS from "../constants/status.js";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
      trim: true,
      select: false,
    },

    avatar: {
      type: String,
      default: null,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

userSchema.index({ phone: 1 });

userSchema.index({ status: 1 });

userSchema.index({ isDeleted: 1 });

userSchema.index({ role: 1, status: 1 });

/*
|--------------------------------------------------------------------------
| Password Hashing
|--------------------------------------------------------------------------
*/

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/*
|--------------------------------------------------------------------------
| Instance Methods
|--------------------------------------------------------------------------
*/

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

/*
|--------------------------------------------------------------------------
| Virtual Fields
|--------------------------------------------------------------------------
*/

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("isLocked").get(function () {
  return !!(
    this.lockUntil &&
    this.lockUntil.getTime() > Date.now()
  );
});

/*
|--------------------------------------------------------------------------
| JSON / Object Transform
|--------------------------------------------------------------------------
*/

const transform = (doc, ret) => {
  delete ret.password;

  return ret;
};

userSchema.set("toJSON", {
  virtuals: true,
  transform,
});

userSchema.set("toObject", {
  virtuals: true,
  transform,
});

const User = mongoose.model("User", userSchema);

export default User;