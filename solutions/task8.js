"use strict";

let zoo = [];

class Animal {
    makeSound() {
        throw new Error("makeSound() must be shadowed");
    }
    constructor() {
        zoo.push(this);
    }
}

class Mammal extends Animal {
    covering = 'fur'
}

class Wolf extends Mammal {
    makeSound() { console.log('Howl'); }
}

class Lion extends Mammal {
    makeSound() { console.log('Roar'); }
}

function eggLayingMixin(Base) {
    return class extends Base {
        #eggsLaidCount = 0;
        #eggPrepared = false;

        prepareEgg() {
            if (this.#eggPrepared) {
                throw new Error("Egg already prepared");
            }
            this.#eggPrepared = true;
            console.log("Egg prepared");
        }

        layEgg() {
            this.#eggPrepared = false;
            this.#eggsLaidCount++;
            console.log("New egg laid. Total: " + this.#eggsLaidCount);
        }
    }
}

class PlatypusBase extends Mammal {
    makeSound() { console.log('Growl'); }
}

class Platypus extends eggLayingMixin(PlatypusBase) {}

class BirdBase extends Animal {
    covering = 'feathers'
    layEgg() { console.log("Laying an egg"); }
}

class Bird extends eggLayingMixin(BirdBase) {}

class Chicken extends Bird {
    makeSound() { console.log('Cluck'); }
}

class Sparrow extends Bird {
    fly() { console.log('Flying'); }
    makeSound() { console.log('Tweet'); }
}

let mamaChicken = new Chicken();
let mamaSparrow = new Sparrow();

let mamaWolf = new Wolf();
let papaWolf = new Wolf();
let babyWolf = new Wolf();

let papaLion = new Lion();

let mamaPlatypus = new Platypus();

zoo.forEach(animalInstance => {
    ['prepareEgg', 'layEgg', 'makeSound', 'fly'].forEach(action => {
        if (typeof animalInstance[action] === 'function') {
            animalInstance[action]();
        } else {
            console.log(`Can't ${action}`);
        }
    })
});