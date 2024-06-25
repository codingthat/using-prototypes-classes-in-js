'use strict'
var o = require('ospec')

o.spec('encapsulated instantiation and zoo iteration', function() {
    let spy = o.spy(),
        taskName = require('path').basename(__filename, '.spec.js'),
        code = require('../.test-common')(taskName),
        zoo, Animal, Mammal, Wolf, Lion, Bird, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf, papaLion
    console.log = o.spy(console.log)
    eval(code + ` spy(zoo, Animal, Mammal, Wolf, Lion, Bird, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf, papaLion);`); // ← this particular semicolon is essential to avoid ASI creating a bug with the next line
    [ zoo, Animal, Mammal, Wolf, Lion, Bird, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf, papaLion ] = spy.calls[0].args
    o.spec('code as executed', function() {
        let startingConsoleLogCallCount
        let expectedConsoleLogCallCount = 12
        o(`calls console.log ${expectedConsoleLogCallCount} times`, function() {
            startingConsoleLogCallCount = console.log.callCount
            eval(code) // must re-run here due to shared spies when testing all
            o(console.log.callCount - startingConsoleLogCallCount).equals(expectedConsoleLogCallCount)
        })
        o(`logs "Can't fly" five times`, function() {
            let cantFlyCount = console.log.calls.slice(-expectedConsoleLogCallCount).reduce(function (a, e) {
                return e.args[0] === "Can't fly"
                    ? a + 1
                    : a
            }, 0)
            o(cantFlyCount).equals(5)
        })    
    })
    o('zoo is an array', function() {
        o(Array.isArray(zoo)).equals(true)
    })
    o('zoo has six elements', function() {
        o(zoo.length).equals(6)
    })
    o('zoo has only animals in it', function() {
        for (let animal of zoo) {
            o(Animal.isPrototypeOf(animal)).equals(true)
        }
    })
    o('code calls .instantiate() six times', function() {
        o(code.match(/\s*\.instantiate\s?\(/mg)?.length).equals(6)
    })
    let animalTypes = {
        Animal: undefined,
        Mammal: 'fur',
        Bird: 'feathers',
    }
    function instantiatesAndPushesToZoo(typeName, obj) {
        o(`${typeName} has instantiate member`, function () {
            o(typeof obj?.instantiate).equals('function')
        })
        o(`${typeName}.instantiate adds correct object to zoo and returns it`, function () {
            let newObj = obj.instantiate()
            o(zoo.at(-1)).equals(newObj)
            o(eval(typeName).isPrototypeOf(newObj)).equals(true)
        })
    }
    for (let animalType in animalTypes) {
        let animalPrototype = eval(animalType)
        o(animalType + ' has makeSound member', function() {
            o(typeof animalPrototype?.makeSound).equals('function')
        })
        o(animalType + '.makeSound throws requested error', function() {
            o(animalPrototype.makeSound).throws("makeSound() must be shadowed")
        })
        instantiatesAndPushesToZoo(animalType, animalPrototype)
        if (animalType === 'Animal') {
            o(animalType + ' has no covering property', function() {
                o(Object.hasOwn(animalPrototype, 'covering')).equals(false)
            })
        } else {
            o(animalType + ' has covering property with requested value', function() {
                o(animalPrototype?.covering).equals(animalTypes[animalType])
            })
            o(animalType + ' inherits makeSound from Animal rather than shadowing it', function() {
                o(animalPrototype.makeSound).equals(Animal.makeSound)
                o(Object.hasOwn(animalPrototype, 'makeSound')).equals(false)
            })
        }
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
        instantiatesAndPushesToZoo(mammalType, mammalPrototype)
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
            instantiatesAndPushesToZoo(birdType, birdPrototype)
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
    o('papaLion has covering property with requested value', function() {
        o(papaLion?.covering).equals('fur')
    })
    hasAndLogsOnce(Lion, 'makeSound', papaLion, 'Roar')
})