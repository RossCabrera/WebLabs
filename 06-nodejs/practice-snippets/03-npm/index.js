// var generateName = require('sillyname');
import generateName from 'sillyname';
import superheroes, { randomSuperhero } from 'superheroes';

var sillyName = generateName();
console.log(`My name is ${sillyName}`)

var mySuperheroName = randomSuperhero();
console.log(`My name is ${mySuperheroName}`)