let Wolf = {
    makeSound() {
        console.log('Howl');
    },
    covering: 'fur',
};

let mamaWolf = Object.create(Wolf);
let papaWolf = Object.create(Wolf);
let babyWolf = Object.create(Wolf);