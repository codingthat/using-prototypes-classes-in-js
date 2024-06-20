"use strict";

let Mammal = {
    makeSound() {
        throw new Error("makeSound() must be shadowed");
    },
    covering: 'fur',
};

let Wolf = Object.create(Mammal);
Wolf.makeSound = () => { console.log('Howl'); };

let Lion = Object.create(Mammal);
Lion.makeSound = () => { console.log('Roar'); };

let Platypus = Object.create(Mammal);
Platypus.makeSound = () => { console.log('Growl'); };

let Bird = {
    makeSound() {
        throw new Error("makeSound() must be shadowed");
    },
    covering: 'feathers'
};

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
let Sparrow = Object.create(Bird);
Sparrow.fly = () => { console.log('Flying'); };

let mamaChicken = Object.create(Chicken);
let mamaSparrow = Object.create(Sparrow);

let mamaPlatypus = Object.create(Platypus);

[mamaChicken, mamaSparrow, mamaPlatypus].forEach(animal => {
    animal.prepareEgg();
    animal.layEgg();
});

let mamaWolf = Object.create(Wolf);
let papaWolf = Object.create(Wolf);
let babyWolf = Object.create(Wolf);