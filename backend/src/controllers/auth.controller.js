import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
import "dotenv/config";
import pkg from 'stream-chat';
const { StreamChat } = pkg;




export async function signup(req, res) {
  const { email, password, fullname } = req.body;
  try {
    // Validate input
    if (!email || !password || !fullname) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "email already exists,please use different one" });
    }


    
    // Create a new user instance
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/boys/${idx}.png`;

    // Create a new user with the provided details
    const newUser = await User.create({
      email,
      fullname,
      password,
      profilePic: randomAvatar,
    });

     await newUser.save();

    try {
      await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullname,
      image: newUser.profilePic || ""
     
    });
    console.log(`User stream upserted successfully: ${newUser.fullname}`);
      
    } catch (error) {
      console.error("Error upserting user stream:", error);
      
      
    }

   
   
    //todo :CREATE THE USER STREAM AS WELL


    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });
    res.status(201).json({success:true,user:newUser})
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email" });
    }
    // Check password
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });
    res.status(200).json({ success: true, user });

    
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
}

export async function logout(req, res) {
  res.clearCookie("token")
  res.status(200).json({ message: "Logged out successfully" });
}

export async function onboard(req,res)
{
 try {
  const { nativeLanguage, learningLanguage, fullname,bio,location } = req.body;
  const userId = req.user._id;

  // Validate input
  if (!nativeLanguage || !learningLanguage || !location || !fullname || !bio) {
    return res.status(400).json({
       message: "All fields are required",
       missingFields: [
        !nativeLanguage && "nativeLanguage",
        !learningLanguage && "learningLanguage",
        !location && "location",
        !fullname && "fullname",
        !bio && "bio"
       ].filter(Boolean),
       
  });
  }

  // Update user onboarding details
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...req.body,
      isOnboarded: true,
    },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  //TODO : UPDATE THEH USER INFO IN STEAM
 
  try {
    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullname,
      image: updatedUser.profilePic || ""
    });
    console.log(`User stream upserted successfully: ${updatedUser.fullname}`);
    
  } catch (error) {
    console.error("Error upserting user stream:", error);
    // Handle the error as needed, e.g., log it or return an error response
    // return res.status(500).json({ message: "Error updating user in stream" });
    
  }



  res.status(200).json({ success: true, user: updatedUser });

  
 } catch (error) {
  console.error("Error during onboarding:", error);
  res.status(500).json({ message: "Internal server error" });
  
 }

}
