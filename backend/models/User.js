import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "seller"], default: "user" },
    avatar: { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// --- FIXED HOOK ---
userSchema.pre("save", async function () {
  // If password isn't modified, just return (no next needed in async hooks)
  if (!this.isModified("password")) return;

  // Hash the password
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
