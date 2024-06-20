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

let Bird = {
    makeSound() {
        throw new Error("makeSound() must be shadowed");
    },
    covering: 'feathers',
    layEgg() {
        console.log("Laying an egg");
    },
};

let Chicken = Object.create(Bird);
Chicken.makeSound = () => { console.log('Cluck'); };

let Sparrow = Object.create(Bird);
Sparrow.fly = () => { console.log('Flying'); };
Sparrow.makeSound = () => { console.log('Tweet'); };

let mamaChicken = Object.create(Chicken);
let mamaSparrow = Object.create(Sparrow);

let mamaWolf = Object.create(Wolf);
let papaWolf = Object.create(Wolf);
let babyWolf = Object.create(Wolf);