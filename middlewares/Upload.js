import multer from "multer";
import path from "path";
import fs from "fs";

// Define an absolute path for uploads (use a temp directory for cloud deployments if necessary)
const uploadDir = path.resolve("uploads");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("Uploads directory created:", uploadDir);
    } catch (error) {
        console.error("Error creating uploads directory:", error);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        if (!file.originalname) {
            return cb(new Error("Invalid file name"), null);
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedFilename = file.originalname
            .replace(/[^a-zA-Z0-9.\-_]/g, '-') 
            .replace(/\s+/g, '-');  

        cb(null, `${sanitizedFilename}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 3 // Max 3 files
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extname) {
            return cb(null, true);
        }
        cb(new Error("Only image files are allowed (jpeg, png, jpg, gif)"));
    }
});

export { upload };
