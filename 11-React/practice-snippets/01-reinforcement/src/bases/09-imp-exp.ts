import { heroes, type Hero, type Owner } from './data/heroes.data';

const getHeroById = (id: number): Hero | undefined => {
  const hero = heroes.find((hero) => {
    return hero.id === id;
  });

  // if (!hero) {
  //   throw new Error(`No existe un héroe con el id ${id}`);
  // }

  return hero;
};

console.log(getHeroById(7));

// Tarea: Obtener los héroes por su propietario

export const getHeroesByOwner = (owner: Owner): Hero[] => {
  return heroes.filter((hero) => hero.owner === owner);
};

console.log(getHeroesByOwner('Marvel'));



