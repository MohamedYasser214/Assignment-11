import mongoose from "mongoose";
import {RoleEnum, GenderEnum, ProviderEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == ProviderEnum.google ? false : true;
      },
      trim: true,
      minLength: 6,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },
    profilePicture: {
      type: String,
    },
    confirmed: {
      type: Boolean,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.system,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.user,
    },
    phone: {
      type: String,
      profilePicture: String,
      confirmed: Boolean,
    },
  },
  {
    timestamps: true,
    // feild not exist
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// افهمهاااااااااا
// =======================================================================================// =======================================================================================// =======================================================================================
userSchema
  .virtual("userName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (v) {
    const [firstName, lastName] = v.split(" ");
    this.set({ firstName: firstName, lastName: lastName });
  });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
