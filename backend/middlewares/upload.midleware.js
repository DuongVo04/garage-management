import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";


const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const createStorage = (folder = "") => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join("uploads", folder);

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
            const uniqueName = Date.now() + "-" + file.originalname;
            cb(null, uniqueName);
        }
    });
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024
    }
});

const createUpload = (folder) => multer({ storage: createStorage(folder) });

/**
 * @param {string} fieldName
 * @param {number} maxCount
 */
export const uploadMultiple = (fieldName = "images", maxCount = 10, folder = "") => {
    const upload = createUpload(folder);

    return [
        upload.array(fieldName, maxCount),
        (req, res, next) => {
            try {
                if (!req.files || req.files.length === 0) {
                    req.uploadedFiles = [];
                    return next();
                }

                req.uploadedFiles = req.files.map(file => ({
                    filename: file.filename,
                    path: `uploads/${folder}/${file.filename}`
                }));

                next();
            } catch (err) {
                next(err);
            }
        }
    ];
};

export const uploadSingle = (fieldName = "image", folder = "") => {
    const upload = createUpload(folder);

    return [
        upload.single(fieldName),
        (req, res, next) => {
            try {
                if (!req.file) {
                    req.uploadedFile = null;
                    return next();
                }

                req.uploadedFile = {
                    filename: req.file.filename,
                    path: `uploads/${folder}/${req.file.filename}`
                };

                next();
            } catch (err) {
                next(err);
            }
        }
    ];
};