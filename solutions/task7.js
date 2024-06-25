"use strict";

let zoo = [];

let Animal = {
    makeSound() {
        throw new Error("makeSound() must be shadowed");
    },
    instantiate() {
        let newInstance = Object.create(this);
        zoo.push(newInstance);
        return newInstance;
    },
};

let Mammal = Object.create(Animal);
Mammal.covering = 'fur';

let Wolf = Object.create(Mammal);
Wolf.makeSound = () => { console.log('Howl'); };

let Lion = Object.create(Mammal);
Lion.makeSound = () => { console.log('Roar'); };

let Platypus = Object.create(Mammal);
Platypus.makeSound = () => { console.log('Growl'); };

let Bird = Object.create(Animal);
Bird.covering = 'feathers';

let eggLayingMixin = {
    eggsLaidCount: 0, // accessed by layEgg
    eggPrepared: false, // accessed by both methods
    prepareEgg() {
        if (this.eggPrepared) {
            throw new Error("Egg already prepared");
        }
        this.eggPrepared = true;
        console.log("Egg prepared");
    },
    layEgg() {
        this.eggPrepared = false;
        this.eggsLaidCount++;
        console.log("New egg laid. Total: " + this.eggsLaidCount);
    }
};

[Bird, Platypus].forEach(animalPrototype => Object.assign(animalPrototype, eggLayingMixin));

let Chicken = Object.create(Bird);
Chicken.makeSound = () => { console.log('Cluck'); };

let Sparrow = Object.create(Bird);
Object.assign(Sparrow, {
    fly() { console.log('Flying'); },
    makeSound() { console.log('Tweet'); },
});

let mamaChicken = Chicken.instantiate();
let mamaSparrow = Sparrow.instantiate();

let mamaWolf = Wolf.instantiate();
let papaWolf = Wolf.instantiate();
let babyWolf = Wolf.instantiate();

let papaLion = Lion.instantiate();

let mamaPlatypus = Platypus.instantiate();

zoo.forEach(animalInstance => {
    ['prepareEgg', 'layEgg', 'makeSound', 'fly'].forEach(action => {
        if (typeof animalInstance[action] === 'function') {
            animalInstance[action]();
        } else {
            console.log(`Can't ${action}`);
        }
    })
});