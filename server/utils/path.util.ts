import { join } from 'path';
import findRoot from 'find-root';

/**
 *
 * @returns {string} root path of the project
 */
export const getRootPath = () => {
    return findRoot(__dirname);
};

export const rootPath = getRootPath();

/**
 * @returns {string} path to the public folder
 */
export const publicPath = join(rootPath, 'public');

/**
 * @returns {string} path to the static folder
 */
export const assetsPath = join(rootPath, 'public/static');

/**
 * @returns {string} path to the static assets folder
 */
export const staticAssetsPath = join(rootPath, 'public/assets');

export const getUploadPathWithYear = () => {
    return '/static/upload/' + new Date().getFullYear();
};
