// const xlsx = require('xlsx');
const logger = require('../config/logger');

exports.upload = (req, res, next) => {
    logger.info(`File uploaded: ${req.file.originalname}`)
    const taskId = 'abc123';
    res.json({ taskId });
}

