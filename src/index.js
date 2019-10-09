import fs from 'fs';
import config from './config/template.config';
import ejs from 'ejs';
import path from 'path';

const rootPath = process.cwd();
const createPath = path.join(rootPath, '/' + config.name);

//已存在文件夹错误处理
function dealError(reject, err) {
    if (err && err.code !== 'EEXIST') {
        reject(console.log(err));
    }
}

//创建文件夹公用方法
function mkdirWithPath(path, msg) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, err => {
            dealError(reject, err);
            resolve(msg ? console.log(msg) : true);
        });
    })
}

//ejs处理文件后写入(也可用作复制文件)
function ejsFile(templatePath, writePath, msg) {
    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, config, (err, str) => {
            if (err) {
                reject(err);
            }
            fs.writeFile(writePath, str, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(msg ? console.log(msg) : true);
            })
        })
    })
}

/*创建文件夹*/
const createRoot = async function () {
    await mkdirWithPath(createPath, '1.创建文件夹成功');
}

/*创建html文件*/
const createHtml = async function () {
    const templateHtmlPath = path.join(rootPath, '/template/index.html');
    const writeHtmlPath = path.join(createPath, '/' + config.name + '.html');
    await ejsFile(templateHtmlPath, writeHtmlPath, '2.创建html文件成功');
}

/*创建img文件夹*/
const createImg = async function () {
    const mkdirImgPath = path.join(createPath, '/img');
    await mkdirWithPath(mkdirImgPath);
    if (config.deepImg) {
        const mkdirDeepImgPath = path.join(mkdirImgPath, '/' + config.name);
        await mkdirWithPath(mkdirDeepImgPath);
    }
    console.log('3.创建img文件夹成功');
}

/*创建css文件夹*/
const createCss = async function () {
    const mkdirCssPath = path.join(createPath, '/css');
    await mkdirWithPath(mkdirCssPath);

    const templateCssPath = path.join(rootPath, '/template/css/index.css');
    const writeCssPath = path.join(mkdirCssPath, '/' + config.name + '.css');
    await ejsFile(templateCssPath, writeCssPath, '4.创建css文件夹成功');
}

/*创建js文件夹*/
const createJs = async function () {
    const mkdirJsPath = path.join(createPath, '/js');
    await mkdirWithPath(mkdirJsPath);

    const templateJqueryPath = path.join(rootPath, '/template/js/jquery-1.8.3.min.js');
    const writeJqueryPath = path.join(mkdirJsPath, '/jquery-1.8.3.min.js');
    await ejsFile(templateJqueryPath, writeJqueryPath);

    const templateJsPath = path.join(rootPath, '/template/js/index.js');
    const writeJsPath = path.join(mkdirJsPath, '/' + config.name + '.js');
    await ejsFile(templateJsPath, writeJsPath, '5.创建js文件夹成功');
}

/*开始创建模板*/
const createTemplate = function () {
    createRoot();
    createHtml();
    createImg();
    createCss();
    createJs();
}

createTemplate();