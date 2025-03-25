import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "./uploads";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
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
        fileSize: 5 * 1024 * 1024, // Increase to 5MB per file
        files: 3 // Allow a maximum of 3 files
    },
    fileFilter: (req, file, cb) => {
        if (!file) {
            return cb(new Error("No file provided"), false);
        }

        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extname) {
            return cb(null, true);
        }
        cb(new Error("Only images are allowed (jpeg, png, jpg, and gif)"), false);
    }
});

export { upload };
