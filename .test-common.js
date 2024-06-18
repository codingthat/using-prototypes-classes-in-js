'use strict'

var o = require('ospec'),
    fs = require('fs')

module.exports = function getCode(taskName) {
    let filename = process.env.TEST_TARGET_DIR
            ? `${process.env.TEST_TARGET_DIR}/main.js`
            : `solutions/${taskName}.js`
    return fs.readFileSync(`${__dirname}/${filename}`).toString()
}