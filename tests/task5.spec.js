'use strict'
var o = require('ospec')

o.spec('extended branching prototype hierarchy', function() {
    let spy = o.spy(),
        taskName = require('path').basename(__filename, '.spec.js'),
        code = require('../.test-common')(taskName),
        Mammal, Wolf, Lion, Bird, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf
    console.log = o.spy(console.log)
    eval(code + ` spy(Mammal, Wolf, Lion, Bird, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf);`); // ← this particular semicolon is essential to avoid ASI creating a bug with the next line
    [ Mammal, Wolf, Lion, Bird, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf ] = spy.calls[0].args
    o('code as executed does not end up calling console.log', function() {
        let startingConsoleLogCallCount = console.log.callCount
        eval(code) // must re-run here due to shared spies when testing all
        o(console.log.callCount - startingConsoleLogCallCount).equals(0)
    })
    let animalTypes = {
        Mammal: 'fur',
        Bird: 'feathers',
    }
    for (let animalType in animalTypes) {
        let animalPrototype = eval(animalType)
        o(animalType + ' has makeSound member', function() {
            o(typeof animalPrototype?.makeSound).equals('function')
        })
        o(animalType + '.makeSound throws requested error', function() {
            o(animalPrototype.makeSound).throws("makeSound() must be shadowed")
        })
        o(animalType + ' has covering property with requested value', function() {
            o(animalPrototype?.covering).equals(animalTypes[animalType])
        })
    }
    let mammalTypes = {
        Wolf: 'Howl',
        Lion: 'Roar',
    }
    function hasAndLogsOnce(typeName, memberName, obj, logValue) {
        o(`${typeName} has ${memberName} member`, function () {
            o(typeof obj?.[memberName]).equals('function')
        })
        o(`${typeName}.${memberName} calls console.log once`, function () {
            let previousCallCount = console.log.callCount
            obj[memberName]()
            o(console.log.callCount).equals(previousCallCount + 1)
        })
        o(`${typeName}.${memberName} calls console.log with requested value`, function () {
            o(console.log.calls.at(-1).args[0]).equals(logValue)
        })
    }
    for (let mammalType in mammalTypes) {
        let mammalPrototype = eval(mammalType)
        o(mammalType + ' has covering property with requested value', function() {
            o(mammalPrototype?.covering).equals('fur')
        })
        hasAndLogsOnce(mammalType, 'makeSound', mammalPrototype, mammalTypes[mammalType])
    }
    let birdTypes = {
        Bird: undefined,
        Chicken: 'Cluck',
        Sparrow: 'Tweet',
    }
    for (let birdType in birdTypes) {
        let birdPrototype = eval(birdType)
        hasAndLogsOnce(birdType, 'layEgg', birdPrototype, "Laying an egg")
        if (birdType !== 'Bird') {
            hasAndLogsOnce(birdType, 'makeSound', birdPrototype, birdTypes[birdType])
            o(birdType + ' has covering property with requested value', function() {
                o(birdPrototype?.covering).equals('feathers')
            })
        }
    }
    hasAndLogsOnce('Sparrow', 'fly', Sparrow, 'Flying')
    hasAndLogsOnce('mamaSparrow', 'fly', mamaSparrow, 'Flying')
    let birdFlock = {
        mamaChicken: 'Cluck',
        mamaSparrow: 'Tweet',
    }
    for (let bird in birdFlock) {
        let birdObj = eval(bird)
        o(bird + ' has covering property with requested value', function() {
            o(birdObj?.covering).equals('feathers')
        })
        hasAndLogsOnce(bird, 'layEgg', birdObj, "Laying an egg")
        hasAndLogsOnce(bird, 'makeSound', birdObj, birdFlock[bird])
    }
    let wolfPack = { mamaWolf, papaWolf, babyWolf }
    for (let wolf in wolfPack) {
        let wolfObj = wolfPack[wolf]
        o(wolf + ' has covering property with requested value', function() {
            o(wolfObj?.covering).equals('fur')
        })
        hasAndLogsOnce(wolf, 'makeSound', wolfObj, 'Howl')
    }
})