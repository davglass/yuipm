
var fs = require('fs'),
    http = require('http'),
    npm = require('npm'),
    cp = require('child_process'),
    Y = require('yui3').silent().useSync('io', 'files'),
    path = require('path');

require('colors');

var args = process.argv = process.argv.slice(2);

var cli = {
    check: function() {
        if (!Y.Files.isDirectory(path.join(process.cwd(), 'node_modules'))) {
            cli.log.warn('No ./node_modules directory found, please use npm to install something');
            return false;
        }
        return true;
    },
    log: {
        info: function(str) {
            console.error('yuipm'.white, 'info'.magenta, str);
        },
        warn: function(str) {
            console.error('yuipm'.white, 'warn'.yellow, str);
        },
        plain: function(str) {
            console.error('     ', str);
        }
    },
    _fetchFilter: function(a, cb) {
        Y.io('http:/'+'/yui.zenfs.com/gallery/index.json', {
            on: {
                success: function(id, e) {
                    var data = JSON.parse(e.responseText);
                    var keys = Object.keys(data).sort().reverse();
                    var top = [];

                    if (a.length) {
                        //Very very simple indexOf check
                        var search = a[0].replace('*', '');
                        top = [];
                        keys.forEach(function(v) {
                            if (v.indexOf(search) > -1) {
                                top.push(v);
                            }
                        });
                    } else {
                        top = keys.splice(0, 10)
                    }
                    if (!top.length && a[0] === 'latest') {
                        top = keys.splice(0, 1);
                    }
                    if (!top.length && a[0] === 'installed') {
                        top = [];
                        keys.forEach(function(v) {
                            if (cli.isInstalled(v)) {
                                top.push(v);
                            }
                        });
                    }
                    cb(top, data);
                }
            }
        });
    },
    _npmLoaded: false,
    _npmInstall: function(info, cb) {
        var url = 'http:/'+'/yui.zenfs.com/gallery/' + info.file;
        cli.log.info('Using npm to install: ' + info.file);
        npm.commands.install([url], function (er, data) {
            if (er) {
                console.error(er);
                return;
            }
            cb();
            // command succeeded, and data might have some info
            cli.log.info('npm completed install: ' + info.file);
        });
    },
    _handleNPM: function(info, cb) {
        if (cli._npmLoaded) {
            cli._npmInstall(info, cb);
        } else {
            cli.log.info('Prepping npm for installs.');
            npm.load({}, function (er) {
                if (er) {
                    console.error(er);
                    return;
                }
                cli._npmInstall(info, cb);
            });
        }
    },
    _fetch: function(top, data, cb) {
        var item = top.pop();
        if (item) {
            cli._handleNPM(data[item], function() {
                cli._fetch(top, data, cb);
            });
        } else {
            cb();
        }
    },
    commands: {
        install: function(a) {
            if (!a[0]) {
                a[0] = 'latest';
            }
            cli._fetchFilter(a, function(top, data) {
                var stack = new Y.Parallel();
                if (top.length) {
                    cli.log.info('installing (' + top.length + ') remote files');
                    
                    cli._fetch(top, data, stack.add(function() {

                    }));
                } else {
                    cli.log.warn('No files given to install');
                }
                stack.done(function() {
                    cli.log.info('Files installed..');
                });
            });
        },
        ls: function(a) {
            cli.log.info('listing remote files');
            cli._fetchFilter(a, function(top) {
                cli.log.info('Showing ' + top.length + ' items.');
                top.forEach(function(v) {
                    cli.log.plain(cli.filterInstalled(v));
                });
            });
        }
    },
    isInstalled: function(name) {
        var p = path.join(process.cwd(), 'node_modules', name);
        if (Y.Files.isDirectory(p)) {
            return true;
        }
        return false;
    },
    filterInstalled: function(name) {
        var str = name;
        if (cli.isInstalled(name)) {
            str += ' √'.bold.yellow;
        }
        return str;
    },
    help: function() {
        cli.log.info('Listing commands');
        cli.log.plain('yuipm ls');
        cli.log.plain('yuipm ls latest');
        cli.log.plain('yuipm ls installed');
        cli.log.plain('yuipm install latest');
        cli.log.plain('yuipm install gallery-2011');
        cli.log.plain('yuipm install gallery-2011.03');
        cli.log.plain('yuipm install 2011.03');
        cli.log.plain('yuipm install all');
    },
    process: function() {
        //console.error(args);
        if (args.length && cli.commands[args[0]]) {
            cli.commands[args[0]](args.splice(1));
        } else {
            cli.help();
        }
    }
};

module.exports = cli;
