YUI Package Manager
===================

**This is a work in progress, it partially works as a proof of concept
while we build the backend to support it.**

The idea is that the _yui-core_ and _yui-gallery_ packages are too large and too frequently
released to be stored in npm.

This CLI tool should also be able to create and manage external YUI packages.

The goal is to host all of the YUI deployment packages (gallery) on our own server, then
use this tool to download meta-data from our server and install our custom **npm** packages 
into your local node_modules directory. Just as if they were first-class npm modules.

Usage
=====

    mkdir testing
    cd testing/
    npm i yui3
    yuipm install gallery-2011.04.27-18-16

    yuipm info Welcome to the YUI Package Manager
    yuipm info installing (1) remote files
    yuipm info Prepping npm for installs.
    yuipm info Using npm to install: gallery-2011.04.27-18-16.tar.gz
    gallery-2011.04.27-18-16@0.0.1 ./node_modules/gallery-2011.04.27-18-16 
    yuipm info Files installed..
    yuipm info npm completed install: gallery-2011.04.27-18-16.tar.gz
    
    npm ls

    /Users/davglass/src/tmp/yuipm
    ├── gallery-2011.04.27-18-16@0.0.1 
    └─┬ yui3@0.6.0 
      ├── htmlparser@1.7.3 
      ├─┬ jsdom@0.2.0 
      │ └── request@1.9.5 
      └── yui3-core@3.3.0 
    
    yuipm ls

    yuipm info Welcome to the YUI Package Manager
    yuipm info listing remote files
    yuipm info Showing 10 items.
          gallery-2011.05.04-20-03
          gallery-2011.04.27-18-16 √
          gallery-2011.04.27-17-14
          gallery-2011.04.20-13-04
          gallery-2011.04.13-22-38
          gallery-2011.04.06-19-44
          gallery-2011.03.30-19-47
          gallery-2011.03.23-22-20
          gallery-2011.03.17-15-28
          gallery-2011.03.16-21-24
    
