import { join } from 'path';
import fs from 'fs';
import utril from 'util';
import { getUploadPathWithYear, publicPath } from './path.util';
const writeFile = utril.promisify(fs.writeFile);

export const createUploadFile = async (filename: string, fileBuffer: Buffer) => {
    const _uploadPath = getUploadPathWithYear();
    const basePath = join(publicPath, _uploadPath);
    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath);
    }

    await writeFile(basePath + '/' + filename, fileBuffer);
    const url = _uploadPath + '/' + filename;
    return url;
};
