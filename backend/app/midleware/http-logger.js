const morgan = require('morgan');
const logger = require('../logger')('http');

logger.stream = {
    write: message =>
        logger.info(message.substring(0, message.lastIndexOf('\n')))
};

module.exports = morgan('dev', {
    stream: logger.stream
});
