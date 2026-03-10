/** Typescript infiere con la información que le brindas 
 * Si es constante te informara que el valor no cambia
 * si es una variable el determinara el tipo de la variable 
 * y te lo hare saber, también puedes ser especifico determinado las 
 * variables ej -> let diceNumber: number
*/

const firstName = 'Fernando';
const lastName = 'Herrera';

let diceNumber = 3;

console.log(firstName, lastName);

const containsLetterH = lastName.includes('H');

console.log({containsLetterH, diceNumber})