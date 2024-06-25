'use strict'
var o = require('ospec')

o.spec('first prototype declaration', function() {
    let spy = o.spy(),
        taskName = require('path').basename(__filename, '.spec.js'),
        code = require('../.test-common')(taskName),
        Wolf
    console.log = o.spy(console.log)
    eval(code + ` spy(Wolf);`)
    Wolf = spy.calls[0].args[0]
    o('has covering property with requested value', function() {
        o(Wolf?.covering).equals('fur')
    })
    o('has makeSound member', function() {
        o(typeof Wolf?.makeSound).equals('function')
    })
    o('makeSound calls console.log once', function() {
        let previousCallCount = console.log.callCount
        Wolf.makeSound()
        o(console.log.callCount).equals(previousCallCount + 1)
    })
    o('makeSound calls console.log with requested value', function() {
        o(console.log.calls.at(-1).args[0]).equals('Howl')
    })
})