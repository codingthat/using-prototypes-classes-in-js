'use strict'
var o = require('ospec')

o.spec('first mixin', function() {
    let spy = o.spy(),
        taskName = require('path').basename(__filename, '.spec.js'),
        code = require('../.test-common')(taskName),
        zoo, Animal, Mammal, Wolf, Lion, Platypus, Bird, eggLayingMixin, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf, papaLion, mamaPlatypus
    console.log = o.spy(console.log)
    eval(code + ` spy(zoo, Animal, Mammal, Wolf, Lion, Platypus, Bird, eggLayingMixin, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf, papaLion, mamaPlatypus);`); // ← this particular semicolon is essential to avoid ASI creating a bug with the next line
    [ zoo, Animal, Mammal, Wolf, Lion, Platypus, Bird, eggLayingMixin, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf, papaLion, mamaPlatypus ] = spy.calls[0].args
    o.spec('code as executed', function() {
        let startingConsoleLogCallCount
        let expectedConsoleLogCallCount = 28
        o(`calls console.log ${expectedConsoleLogCallCount} times`, function() {
            startingConsoleLogCallCount = console.log.callCount
            eval(code) // must re-run here due to shared spies when testing all
            o(console.log.callCount - startingConsoleLogCallCount).equals(expectedConsoleLogCallCount)
        })
        let inabilities = {
            fly: 6,
            prepareEgg: 4,
            layEgg: 4,
        }
        for (let inability in inabilities) {
            let expectedCount = inabilities[inability]
            o(`code as executed logs "Can't ${inability}" ${expectedCount} times`, function() {
                let cantDoItCount = console.log.calls.slice(-expectedConsoleLogCallCount).reduce(function (a, e) {
                    return e.args[0] === "Can't " + inability
                        ? a + 1
                        : a
                }, 0)
                o(cantDoItCount).equals(expectedCount)
            })
        }    
    })
    o('zoo is an array', function() {
        o(Array.isArray(zoo)).equals(true)
    })
    o('zoo has seven elements', function() {
        o(zoo.length).equals(7)
    })
    o('zoo has only animals in it', function() {
        for (let animal of zoo) {
            o(Animal.isPrototypeOf(animal)).equals(true)
        }
    })
    o('code calls .instantiate() seven times', function() {
        o(code.match(/\s*\.instantiate\s?\(/mg)?.length).equals(7)
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
        Platypus: 'Growl',
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
        if (birdType !== 'Bird') {
            instantiatesAndPushesToZoo(birdType, birdPrototype)
            hasAndLogsOnce(birdType, 'makeSound', birdPrototype, birdTypes[birdType])
            o(birdType + ' has covering property with requested value', function() {
                o(birdPrototype?.covering).equals('feathers')
            })
        }
    }
    for (let eggLayingPrototype of [ Chicken, Sparrow ]) {
        // this is only because I'm testing as if they
        // were instances, which normally they're not,
        // so here they need to shadow explicitly
        if (eggLayingPrototype) {
            eggLayingPrototype.eggPrepared = false;
            eggLayingPrototype.eggsLaidCount = 0;
        }
    }
    for (let eggLayingType in { Bird, Chicken, Sparrow, Platypus }) {
        let eggLayingPrototype = eval(eggLayingType)
        hasAndLogsOnce(eggLayingType, 'prepareEgg', eggLayingPrototype, "Egg prepared")
        hasAndLogsOnce(eggLayingType, 'layEgg', eggLayingPrototype, "New egg laid. Total: 1")
        o(eggLayingType + ' uses layEgg from mixin', function() {
            o(eggLayingPrototype.layEgg).equals(eggLayingMixin.layEgg)
        })
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
        hasAndLogsOnce(bird, 'prepareEgg', birdObj, "Egg prepared")
        hasAndLogsOnce(bird, 'layEgg', birdObj, "New egg laid. Total: 2")
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
    o('mamaPlatypus has covering property with requested value', function() {
        o(mamaPlatypus?.covering).equals('fur')
    })
    hasAndLogsOnce('mamaPlatypus', 'makeSound', mamaPlatypus, 'Growl')
    hasAndLogsOnce('mamaPlatypus', 'prepareEgg', mamaPlatypus, "Egg prepared")
    hasAndLogsOnce('mamaPlatypus', 'layEgg', mamaPlatypus, "New egg laid. Total: 2")
})