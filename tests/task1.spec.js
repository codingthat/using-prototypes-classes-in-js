'use strict'
var o = require('ospec')

o.spec('first prototype declaration', function() {
    let spy = o.spy(),
        taskName = require('path').basename(__filename, '.spec.js'),
        code = require('../.test-common')(taskName),
        Wolf
    eval(code + ` spy(Wolf);`)
    Wolf = spy.calls[0].args[0]
    o('has covering property with requested value', function() {
        o(Wolf?.covering).equals('fur')
    })
    o('has makeSound member', function() {
        o(typeof Wolf?.makeSound).equals('function')
    })
    console.log = o.spy(console.log)
    o('makeSound calls console.log once', function() {
        o(console.log.callCount).equals(0)
        Wolf.makeSound()
        o(console.log.callCount).equals(1)
    })
    o('makeSound calls console.log with requested value', function() {
        o(console.log.calls[0].args[0]).equals('Howl')
    })
})