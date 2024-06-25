'use strict'
var o = require('ospec')

o.spec('first branching prototype hierarchy', function() {
    let spy = o.spy(),
        taskName = require('path').basename(__filename, '.spec.js'),
        code = require('../.test-common')(taskName),
        Mammal, Wolf, Lion, mamaWolf, papaWolf, babyWolf
    console.log = o.spy(console.log)
    eval(code + ` spy(Mammal, Wolf, Lion, mamaWolf, papaWolf, babyWolf);`); // ← this particular semicolon is essential to avoid ASI creating a bug with the next line
    [ Mammal, Wolf, Lion, mamaWolf, papaWolf, babyWolf ] = spy.calls[0].args
    o('code as executed does not end up calling console.log', function() {
        o(console.log.callCount).equals(0)
    })
    o('Mammal.makeSound throws requested error', function() {
        o(Mammal.makeSound).throws("makeSound() must be shadowed")
    })
    let mammalTypes = {
        Wolf: 'Howl',
        Lion: 'Roar',
    }
    for (let mammalType in mammalTypes) {
        let mammalPrototype = eval(mammalType)
        o(mammalType + ' has covering property with requested value', function() {
            o(mammalPrototype?.covering).equals('fur')
        })
        o(mammalType + ' has makeSound member', function() {
            o(typeof mammalPrototype?.makeSound).equals('function')
        })
        o(mammalType + '.makeSound calls console.log once', function() {
            let previousCallCount = console.log.callCount
            mammalPrototype.makeSound()
            o(console.log.callCount).equals(previousCallCount + 1)
        })
        o(mammalType + '.makeSound calls console.log with requested value', function() {
            o(console.log.calls.at(-1).args[0]).equals(mammalTypes[mammalType])
        })
    }
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