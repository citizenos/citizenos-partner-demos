'use strict';

var express = require('express');
var app = express();
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'info';


app.use(express.static(path.join(__dirname, '/public')));

var host = process.env.HOST || null;

var portHttp = process.env.PORT || 3004;
http.createServer(app).listen(portHttp, host, function (err, res) {
    if (err) {
        logger.info('Failed to start HTTP server on port' + portHttp, err);

        return;
    }
    logger.info('HTTP server listening on port ' + portHttp);
});


if (app.get('env') === 'development') {
    var portHttps = process.env.PORT_SSL || 3005;
    var options = {
        key: fs.readFileSync('./config/certs/dev.citizenospartner.com.key'),
        cert: fs.readFileSync('./config/certs/dev.citizenospartner.com.crt')
    };

    https.createServer(options, app).listen(portHttps, host, function (err) {
        if (err) {
            logger.info('Failed to start HTTPS server on port' + portHttps, err);

            return;
        }
        logger.info('HTTPS server listening on port ' + portHttps);
    });
}
