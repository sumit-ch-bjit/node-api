const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `[${info.timestamp}] ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        // new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'app.log' }) // Log to file
    ]
});

module.exports = logger;
