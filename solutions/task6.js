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

let Bird = Object.create(Animal);
Object.assign(Bird, {
    covering: 'feathers',
    layEgg() { console.log("Laying an egg"); },
});

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

zoo.forEach(animalInstance => {
    ['makeSound', 'fly'].forEach(action => {
        if (typeof animalInstance[action] === 'function') {
            animalInstance[action]();
        } else {
            console.log(`Can't ${action}`);
        }
    })
});