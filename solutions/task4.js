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

let mamaWolf = Object.create(Wolf);
let papaWolf = Object.create(Wolf);
let babyWolf = Object.create(Wolf);