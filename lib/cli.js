#!/usr/bin/env node

var cli = require('yuipm');

cli.log.info('Welcome to the YUI Package Manager');

if (!cli.check()) {
    process.exit(1);
}

cli.process();
