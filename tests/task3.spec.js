'use strict'
var o = require('ospec')

o.spec('deletion and prototype chain demonstration', function() {
    let spy = o.spy(),
        taskName = require('path').basename(__filename, '.spec.js'),
        code = require('../.test-common')(taskName),
        Wolf, mamaWolf, papaWolf, babyWolf
    console.log = o.spy(console.log)
    eval(code + ` spy(Wolf, mamaWolf, papaWolf, babyWolf);`); // ← this particular semicolon is essential to avoid ASI creating a bug with the next line
    [ Wolf, mamaWolf, papaWolf, babyWolf ] = spy.calls[0].args
    o('code calls console.log thrice', function() {
        let startingConsoleLogCallCount = console.log.callCount
        eval(code) // must re-run here due to shared spies when testing all
        o(console.log.callCount - startingConsoleLogCallCount).equals(3)
    })
    o('code assigns .name four times', function() {
        o(code.match(/\s*\.name\s?=/mg)?.length).equals(4)
    })
    o('code uses delete as requested, once', function() {
        o(code.match(/\s*delete\sbabyWolf\.name/m)?.length).equals(1)
    })
    let expectedLines = [
        'Mama Wolf, Papa Wolf, Baby Wolf',
        'Mama Wolf, Papa Wolf, Baby Wolf',
        'Mama Wolf, Papa Wolf, Anonymous Wolf',
    ]
    for (let i of expectedLines.keys()) {
        o(`console.log output line #${i+1} is as expected`, function() {
            o(console.log.calls.at(-expectedLines.length+i).args[0]).equals(expectedLines[i])
        })    
    }
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
    let wolfPack = {
        mamaWolf: 'Mama Wolf',
        papaWolf: 'Papa Wolf',
        babyWolf: 'Anonymous Wolf',
    }
    for (let wolf in wolfPack) {
        let wolfObj = eval(wolf)
        o(wolf + ' has covering property with requested value', function() {
            o(wolfObj?.covering).equals('fur')
        })
        o(wolf + ' has name property with requested value', function() {
            o(wolfObj?.name).equals(wolfPack[wolf])
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