import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const { username, email, password, phone, address, role, wishlist } = req.body;
    const imageFilePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    try {
        if (!username || !email || !password || !phone || !address) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            image: imageFilePath,
            phone,
            address,
            role,
            wishlist: Array.isArray(wishlist) ? wishlist : [] 
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "User created successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with that email." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        if (!process.env.SECRET_KEY) {
            console.error("SECRET_KEY is not defined in environment variables.");
            return res.status(500).json({ success: false, message: "Server configuration error." });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email, role: user.role }, 
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, 
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production" 
        });

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                _id: user._id,
                username: user.username, 
                email: user.email,
                role: user.role,
                image: user.image || null 
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password -role");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(200).json({ success: true, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -role");
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { username, phone, address } = req.body;
        const imageFilePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, phone, address, ...(imageFilePath && { image: imageFilePath }) },
            { new: true, runValidators: true }
        ).select("-password -role");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, message: "Profile updated successfully!", user: updatedUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Modify password
export const modifyPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Incorrect old password." });
        }

        user.password = await bcrypt.hash(newPassword, 10); 
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(200).json({ success: true, message: "User deleted successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};
