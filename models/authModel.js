const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Role can be 'user' or 'admin'
    default: "user", // Default role is 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  isLocked: {
    type: Boolean,
  },
  lockUntil: {
    type: Date,
  },

  // failedLoginAttempts: Number,
  // isLocked: Boolean,
  // lockUntil: Date,
});

// authSchema.pre("save", function (next) {
//   if (!this.isModified("password")) return next();

//   // Check if the user has exceeded the allowed login attempts
//   if (this.failedLoginAttempts >= 5 && !this.isLocked) {
//     this.isLocked = true;
//     this.lockUntil = Date.now() + 10 * 60 * 1000; // Lock for 10 minutes
//   }

//   next();
// });

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
