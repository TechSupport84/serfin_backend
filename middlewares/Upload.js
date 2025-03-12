import multer from "multer";
import path from "path"
import  fs from "fs"

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const uploadDir = "./uploads";
        if(!fs.existsSync(uploadDir))
        {
            fs.mkdirSync(uploadDir)
        }
        cb(null, uploadDir)
    },
    filename :(req, file, cb) =>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()  *1E9);
        const sanitizedFilename = file.originalname
        .replace(/[^a-zA-Z0-9-_]/g,'-')
        .replace(/\s+/g, '-')
        .replace(/\.[^/.]+$/,'');

        cb(null, `${sanitizedFilename}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage :storage,
    limits: {fileSize: 2000000},
    fileFilter: (req, file, cb)=>{
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
        if(mimeType && extname)
        {
            return cb(null, true)
        }
        cb(new Error ("Only images  are allowed (jped, png, jpg, and gif"))
    }
})

export{upload}