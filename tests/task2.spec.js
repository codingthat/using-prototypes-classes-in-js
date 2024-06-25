'use strict'
var o = require('ospec')

o.spec('first instantiations', function() {
    let spy = o.spy(),
        taskName = require('path').basename(__filename, '.spec.js'),
        code = require('../.test-common')(taskName),
        Wolf, mamaWolf, papaWolf, babyWolf
    console.log = o.spy(console.log)
    eval(code + ` spy(Wolf, mamaWolf, papaWolf, babyWolf);`); // ← this particular semicolon is essential to avoid ASI creating a bug with the next line
    [ Wolf, mamaWolf, papaWolf, babyWolf ] = spy.calls[0].args
    o('Wolf has covering property with requested value', function() {
        o(Wolf?.covering).equals('fur')
    })
    o('Wolf has makeSound member', function() {
        o(typeof Wolf?.makeSound).equals('function')
    })
    o('Wolf.makeSound calls console.log once', function() {
        let previousCallCount = console.log.callCount
        Wolf.makeSound()
        o(console.log.callCount).equals(previousCallCount + 1)
    })
    o('Wolf.makeSound calls console.log with requested value', function() {
        o(console.log.calls.at(-1).args[0]).equals('Howl')
    })
    let wolfPack = { mamaWolf, papaWolf, babyWolf }
    for (let wolf in wolfPack) {
        let wolfObj = wolfPack[wolf]
        o(wolf + ' has covering property with requested value', function() {
            o(wolfObj?.covering).equals('fur')
        })
        o(wolf + ' has makeSound member', function() {
            o(typeof wolfObj?.makeSound).equals('function')
        })
        o(wolf + '.makeSound calls console.log once', function() {
            let previousCallCount = console.log.callCount
            wolfObj.makeSound()
            o(console.log.callCount).equals(previousCallCount + 1)
        })
        o(wolf + '.makeSound calls console.log with requested value', function() {
            o(console.log.calls.at(-1).args[0]).equals('Howl')
        })
    }
})