

const ironman = //esto es constante 
{ // porperties and objects pueden variar 
  firstName: 'Tony',
  lastName: 'Stark',
  age: 45,
  address: {
    postalCode: 'ABC123',
    city: 'New York',
  },
};

// const spiderman = { ...ironman }; solo pasa las properties, address lo pasaría tal cual 

const spiderman = structuredClone(ironman); // aca si pasaría todo 


spiderman.firstName = 'Peter';
spiderman.lastName = 'Parker';
spiderman.age = 22;
spiderman.address.city = 'San José';

console.log(ironman, spiderman);