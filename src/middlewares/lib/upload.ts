import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedMimeTypes = ['image/jpg', 'image/gif', 'image/jpeg', 'image/png'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new Error('Bu Resim Tipi Desteklenmemektedir. Lütfen Farklı Bir Resim Seçiniz !'), false);
    } else {
        cb(null, true);
    }
};

const storage = multer.diskStorage({
    destination: (req: any, file: Express.Multer.File, cb:any) => {
        const rootDir = path.dirname(require.main?.filename || '');
        const destinationPath = path.join(rootDir, '/public/uploads');
        
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }
        
        cb(null, destinationPath);
    },
    filename: (req: any, file: Express.Multer.File, cb:any) => {
        const extension = file.mimetype.split('/')[1];
        
        if (!req.savedImages) req.savedImages = [];
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        const url = `image_${uniqueSuffix}.${extension}`;
        
        req.savedImages = [...req.savedImages, url];
        
        cb(null, url);
    }
});

const upload = multer({ storage, fileFilter }).array('images');

export default upload;