import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullname: {   type: String, required: true },
  email: { type: String, required: true, unique: true },    
  password: { type: String, required: true ,minlength: 6 },
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  nativeLanguage: { type: String, default: "" },
  learningLanguage: { type: String, default: "" },
  location: { type: String, default: "" },
  isOnboarded: { type: Boolean, default: false },
  friends:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
},{timestamps: true});


// Pre-save hook to hash the password before saving
userSchema.pre('save',async function(next) {
  if (!this.isModified('password')) return next(); // Only hash if password is modified
  try{
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed to save the user
  }catch (error) {
    console.error('Error during pre-save hook:', error);
    next(error); // Pass the error to the next middleware
  }
});
// Method to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};
const User = mongoose.model("User", userSchema);
export default User;