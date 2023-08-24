const fs = require('fs');
const logger = require('../logger/logger')

function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                logger.error(`Error reading ${filename}: ${err.message}`);
                reject(err);
            } else {
                logger.info(`Read ${filename}`);
                resolve(data);
            }
        });
    });
}

function writeFile(filename, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, content, 'utf8', err => {
            if (err) {
                logger.error(`Error writing ${filename}: ${err.message}`);
                reject(err);
            } else {
                logger.info(`Wrote ${filename}`);
                resolve();
            }
        });
    });
}

module.exports = { readFile, writeFile };
