import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Access forbidden: No token provided." });
        }

        const tokenParts = authHeader.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json({ success: false, message: "Invalid authorization format." });
        }

        const token = tokenParts[1];

        if (!process.env.SECRET_KEY) {
            console.error("SECRET_KEY is not defined in environment variables.");
            return res.status(500).json({ success: false, message: "Server configuration error." });
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: "Invalid or expired token." });
            }

            // Attach full user info from token
            req.user = {
                _id: decoded.id,
                username: decoded.username,
                email: decoded.email,
                role: decoded.role, // Ensure role is present
            };

            next();
        });
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error occurred." });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access forbidden: Admins only." });
    }

    next();
};

const me = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    res.status(200).json({ success: true, user: req.user });
};
export { authenticate, isAdmin, me };
