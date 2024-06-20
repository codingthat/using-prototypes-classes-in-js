"use strict";

let Wolf = {
    makeSound() {
        console.log('Howl');
    },
    covering: 'fur',
};

let mamaWolf = Object.create(Wolf);
let papaWolf = Object.create(Wolf);
let babyWolf = Object.create(Wolf);

mamaWolf.name = 'Mama Wolf';
papaWolf.name = 'Papa Wolf';
babyWolf.name = 'Baby Wolf';

console.log([mamaWolf, papaWolf, babyWolf].map(wolf => wolf.name).join(', '));

Wolf.name = 'Anonymous Wolf';

console.log([mamaWolf, papaWolf, babyWolf].map(wolf => wolf.name).join(', '));

delete babyWolf.name;

console.log([mamaWolf, papaWolf, babyWolf].map(wolf => wolf.name).join(', '));