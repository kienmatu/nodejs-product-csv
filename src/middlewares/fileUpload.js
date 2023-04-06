import fs from 'fs';
import multer from 'multer';
import appDir from "../utils/pathHelper.js";


const storage = multer.diskStorage({
    destination: (_req, file, callback) => {
        const dir = appDir + 'static/uploads';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        callback(null, dir);
    },
    filename: (_req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    },
});

const csvFilter = (_req, file, callback) => {
    console.log('Reading file in middleware', file.originalname);
    if (!file) {
        callback('Please upload a file to proceed.', false);
    } else if (file.mimetype.includes('csv')) {
        callback(null, true);
    } else {
        callback('Please upload only csv file as only CSV is supported for now.', false);
    }
};

export default multer({
    storage: storage,
    fileFilter: csvFilter
});