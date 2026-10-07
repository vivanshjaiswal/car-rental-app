import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/userModel.js";
import adminInvite from "../models/adminInvite.js";


const TOKEN_EXPIRES_IN =  "24h";
const JWT_SECRET = 'your_jwt_secret_here';
const createToken = (user) => {
  const secret = JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined on the server");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    secret,
    {
      expiresIn: TOKEN_EXPIRES_IN
    }
  );
};

export async function adminRegister(req, res) {
  try {
    const name = String(req.body.name || "").trim();
    const emailRaw = String(req.body.email || "").trim();
    const email = validator.normalizeEmail(emailRaw) || emailRaw.toLowerCase();
    const password = String(req.body.password || "");
    const inviteCode = String(req.body.inviteCode || "").trim();


  

    if (!name || !email || !password || !inviteCode) {
  return res.status(400).json({
    success: false,
    message: "All fields are required."
  });
}

  if (!validator.isEmail(email)) {
  return res.status(400).json({
    success: false,
    message: "Invalid email."
  });
}
if (password.length < 8) {
  return res.status(400).json({
    success: false,
    message: "Password must be at least 8 characters."
  });
}

const invite = await adminInvite.findOne({
  code: inviteCode,
  assignedEmail: email,
  isUsed: false
});

if (!invite) {
  return res.status(403).json({
    success: false,
    message: "Invalid or already used invite code."
  });
}

const exists = await User.findOne({ email }).lean();

if (exists) {
  return res.status(409).json({
    success: false,
    message: "User already exists."
  });
}
const hashedPassword = await bcrypt.hash(password, 10);

const user = new User({
  name,
  email,
  password: hashedPassword,
  role: "admin"
});

await user.save();
invite.isUsed = true;
await invite.save();



const token = createToken(user);

return res.status(201).json({
  success: true,
  message: "Admin account created successfully.",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});



  } catch (err) {
    console.error("Admin register error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
}
export async function register(req, res) {
  try {
    console.log("REGISTER FUNCTION HIT");
    const name = String(req.body.name || "").trim();
    const emailRaw = String(req.body.email || "").trim();
    const email = validator.normalizeEmail(emailRaw) || emailRaw.toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const exists = await User.findOne({ email }).lean();
    if (exists) return res.status(409).json({ success: false, message: "User already exists." });

    const newId = new mongoose.Types.ObjectId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      _id: newId,
      name,
      email,
      password: hashedPassword,
      role:"user"
    });

      console.log("USER BEFORE SAVE:", user.toObject());
    await user.save();
    console.log("USER AFTER SAVE:", user.toObject());

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });


  
    
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === 11000) return res.status(409).json({ success: false, message: "User already exists." });
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

export async function login(req, res) {
  try {
    const emailRaw = String(req.body.email || "").trim();
    const email = validator.normalizeEmail(emailRaw) || emailRaw.toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password." });

   const token = jwt.sign(
  {
    id: user._id,
    role: user.role
  },
  JWT_SECRET,
  { expiresIn: "1d" }
);


    return res.status(200).json({
  success: true,
  message: "Login successful!",
  token,
  user: { id: user._id, name: user.name, email: user.email },
});


  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}


export async function adminLogin(req, res) {
    try {
        const emailRaw = String(req.body.email || "").trim();
        const email = validator.normalizeEmail(emailRaw) || emailRaw.toLowerCase();
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const token = createToken(user);

        return res.status(200).json({
            success: true,
            message: "Admin login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Admin login error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
}