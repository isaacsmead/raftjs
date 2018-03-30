const Debug = require('debug');
const path = require('path');

module.exports = (filePath) => {
    const filename = path.basename(filePath, path.extname(filePath));
    const log = Debug(filename);
    log.log = console.log.bind(console);
    const error = Debug(filename);
    return({log, error});
};