import multer from "multer";
import path from "path";
import fs from "fs";

// Define the upload directory
const uploadDir = path.resolve("uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Uploads directory created at: ${uploadDir}`);
    } catch (error) {
        console.error("Failed to create uploads directory:", error);
    }
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        if (!file.originalname) {
            return cb(new Error("Invalid file name"));
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const sanitizedFilename = file.originalname
            .replace(/[^a-zA-Z0-9.\-_]/g, "-") // Remove unwanted characters
            .replace(/\s+/g, "-"); // Replace spaces with hyphens

        cb(null, `${sanitizedFilename}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter to allow only specific image formats
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isMimeTypeValid = allowedTypes.test(file.mimetype);
    const isExtNameValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isMimeTypeValid && isExtNameValid) {
        return cb(null, true);
    }
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif)"));
};

// Multer upload configuration
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
        files: 3 // Limit to 3 files per request
    },
    fileFilter
});

export { upload };
