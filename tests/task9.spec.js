'use strict'
const { type } = require('os')
var o = require('ospec')

o.spec('using private class fields', function() {
    let spy = o.spy(),
        taskName = require('path').basename(__filename, '.spec.js'),
        code = require('../.test-common')(taskName),
        zoo, Animal, Mammal, Wolf, Lion, eggLayingMixin, PlatypusBase, Platypus, BirdBase, Bird, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf, papaLion, mamaPlatypus
    console.log = o.spy(console.log)
    eval(code + ` spy(zoo, Animal, Mammal, Wolf, Lion, eggLayingMixin, PlatypusBase, Platypus, BirdBase, Bird, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf, papaLion, mamaPlatypus);`); // ← this particular semicolon is essential to avoid ASI creating a bug with the next line
    [ zoo, Animal, Mammal, Wolf, Lion, eggLayingMixin, PlatypusBase, Platypus, BirdBase, Bird, Chicken, Sparrow, mamaChicken, mamaSparrow, mamaWolf, papaWolf, babyWolf, papaLion, mamaPlatypus ] = spy.calls[0].args
    o('code as executed calls console.log 28 times', function() {
        o(console.log.callCount).equals(28)
    })
    let inabilities = {
        fly: 6,
        prepareEgg: 4,
        layEgg: 4,
    }
    for (let inability in inabilities) {
        let expectedCount = inabilities[inability]
        o(`code as executed logs "Can't ${inability}" ${expectedCount} times`, function() {
            let cantDoItCount = console.log.calls.reduce(function (a, e) {
                return e.args[0] === "Can't " + inability
                    ? a + 1
                    : a
            }, 0)
            o(cantDoItCount).equals(expectedCount)
        })
    }
    o('zoo is an array', function() {
        o(Array.isArray(zoo)).equals(true)
    })
    o('zoo has seven elements', function() {
        o(zoo.length).equals(7)
    })
    o('zoo has only animals in it', function() {
        for (let animal of zoo) {
            o(animal instanceof Animal).equals(true)
        }
    })
    o('code does not contain .instantiate', function() {
        o(code.match(/\s*\.instantiate\s?\(/mg)).equals(null)
    })
    o('code does not contain Object.create', function() {
        o(code.match(/\s*Object\.create\s?\(/mg)).equals(null)
    })
    o('code uses new keyword seven times', function() {
        o(code.match(/=\s*new\s+\S+\s*\(/mg)?.length).equals(7)
    })
    o('code contains eggLayingMixin function', function() {
        o(typeof eggLayingMixin).equals('function')
    })
    o('code uses eggLayingMixin function as requested', function() {
        o(code.match(/\s*class\s+Platypus\s+extends\s+eggLayingMixin\s*\(\s*PlatypusBase\s*\)\s*{\s*\}/m)?.length).equals(1)
        o(code.match(/\s*class\s+Bird\s+extends\s+eggLayingMixin\s*\(\s*BirdBase\s*\)\s*{\s*\}/m)?.length).equals(1)
    })
    o('code contains #eggPrepared four times as requested', function() {
        o(code.match(/#eggPrepared/mg)?.length).equals(4)
    })
    o('code contains #eggsLaidCount four times as requested', function() {
        o(code.match(/#eggsLaidCount/mg)?.length).equals(4)
    })
    o('code does not contain eggPrepared without # prefix', function() {
        o(code.match(/[^#]eggPrepared/mg)).equals(null)
    })
    o('code does not contain eggsLaidCount without # prefix', function() {
        o(code.match(/[^#]eggsLaidCount/mg)).equals(null)
    })
    let animalTypes = {
        Animal: undefined,
        Mammal: 'fur',
        Bird: 'feathers',
    }
    function instantiatesAndPushesToZoo(typeName, classType) {
        o(`${typeName} has constructor member`, function () {
            o(typeof classType?.constructor).equals('function')
        })
        o(`${typeName}.constructor adds correct object to zoo and returns it`, function () {
            let newObj = new classType()
            o(zoo.at(-1)).equals(newObj)
            o(newObj instanceof classType).equals(true)
        })
    }
    for (let animalType in animalTypes) {
        let classType = eval(animalType)
        o(animalType + ' has makeSound member', function() {
            o('makeSound' in classType?.prototype).equals(true)
        })
        o(animalType + '.makeSound throws requested error', function() {
            o(classType?.prototype.makeSound).throws("makeSound() must be shadowed")
        })
        instantiatesAndPushesToZoo(animalType, classType)
        if (animalType === 'Animal') {
            o(animalType + ' has no covering property', function() {
                o(Object.hasOwn(classType?.prototype, 'covering')).equals(false)
            })
        } else {
            o(animalType + ' has covering property with requested value', function() {
                let instance = new classType()
                o(instance?.covering).equals(animalTypes[animalType])
            })
            o(animalType + ' inherits makeSound from Animal rather than shadowing it', function() {
                let instance = new classType()
                let animalInstance = new Animal()
                o(instance?.makeSound).equals(animalInstance.makeSound)
                o(Object.hasOwn(instance, 'makeSound')).equals(false)
            })
        }
    }
    let mammalTypes = {
        Wolf: 'Howl',
        Lion: 'Roar',
        Platypus: 'Growl',
        PlatypusBase: 'Growl',
    }
    function hasAndLogsOnce(typeName, memberName, obj, logValue) {
        o(`${typeName} has ${memberName} member`, function () {
            if (obj[memberName]) {
                o(typeof obj[memberName]).equals('function')
            } else {
                o(typeof obj?.prototype?.[memberName]).equals('function')
            }
        })
        o(`${typeName}.${memberName} calls console.log once`, function () {
            let previousCallCount = console.log.callCount
            if (obj[memberName]) {
                obj[memberName]()
            } else {
                let instance = new obj()
                instance[memberName]()
            }
            o(console.log.callCount).equals(previousCallCount + 1)
        })
        o(`${typeName}.${memberName} calls console.log with requested value`, function () {
            o(console.log.calls.at(-1).args[0]).equals(logValue)
        })
    }
    for (let mammalType in mammalTypes) {
        let classType = eval(mammalType)
        o(mammalType + ' has covering property with requested value', function() {
            let instance = new classType()
            o(instance?.covering).equals('fur')
        })
        hasAndLogsOnce(mammalType, 'makeSound', classType, mammalTypes[mammalType])
        instantiatesAndPushesToZoo(mammalType, classType)
    }
    let birdTypes = {
        Bird: undefined,
        BirdBase: undefined,
        Chicken: 'Cluck',
        Sparrow: 'Tweet',
    }
    for (let birdType in birdTypes) {
        let birdPrototype = eval(birdType)
        if (!birdType.startsWith('Bird')) {
            instantiatesAndPushesToZoo(birdType, birdPrototype)
            hasAndLogsOnce(birdType, 'makeSound', birdPrototype, birdTypes[birdType])
            o(birdType + ' has covering property with requested value', function() {
                let instance = new birdPrototype()
                o(instance?.covering).equals('feathers')
            })
        }
    }
    for (let eggLayingPrototype of [ Chicken, Sparrow ]) {
        // this is only because I'm testing as if they
        // were instances, which normally they're not,
        // so here they need to shadow explicitly
        eggLayingPrototype.eggPrepared = false;
        eggLayingPrototype.eggsLaidCount = 0;
    }
    for (let eggLayingType in { Bird, Chicken, Sparrow, Platypus }) {
        let eggLayingPrototype = eval(eggLayingType)
        hasAndLogsOnce(eggLayingType, 'prepareEgg', eggLayingPrototype, "Egg prepared")
        hasAndLogsOnce(eggLayingType, 'layEgg', eggLayingPrototype, "New egg laid. Total: 1")
        o(eggLayingType + ' has getEggsLaidCount member returning expected value', function () {
            o(typeof eggLayingPrototype?.prototype?.getEggsLaidCount).equals('function')
            let instance = new eggLayingPrototype()
            o(instance.getEggsLaidCount()).equals(0)
        })
        o(eggLayingType + ' uses layEgg from mixin', function() {
            o(eggLayingPrototype.layEgg).equals(eggLayingMixin.layEgg)
        })
    }
    hasAndLogsOnce('Sparrow', 'fly', Sparrow, 'Flying')
    hasAndLogsOnce('mamaSparrow', 'fly', mamaSparrow, 'Still flying, 1 egg(s) later')
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
        o(bird + ' has getEggsLaidCount member returning expected value', function () {
            o(typeof birdObj?.getEggsLaidCount).equals('function')
            o(birdObj.getEggsLaidCount()).equals(2)
        })
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