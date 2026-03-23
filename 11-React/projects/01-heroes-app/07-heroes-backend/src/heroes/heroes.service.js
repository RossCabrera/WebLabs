"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroesService = void 0;
const common_1 = require("@nestjs/common");
const heroes_data_1 = require("../data/heroes.data");
let HeroesService = class HeroesService {
    heroes = structuredClone(heroes_data_1.heroesData);
    create(createHeroDto) {
        const hero = {
            ...createHeroDto,
            id: `${this.heroes.length + 1}`,
            slug: createHeroDto.name.toLowerCase().replace(/ /g, '-'),
        };
        this.heroes.push(hero);
        return hero;
    }
    findAll(paginationDto) {
        const { limit = 6, offset = 0, category = 'all' } = paginationDto;
        let heroes = [...this.heroes];
        let heroCount = heroes.length;
        if (category !== 'all') {
            heroes = heroes.filter((hero) => hero.category.toLowerCase() === category.toLowerCase());
            heroCount = heroes.length;
        }
        heroes = heroes.slice(offset, offset + limit);
        return {
            total: heroCount,
            pages: Math.ceil(heroCount / limit),
            heroes,
        };
    }
    findOne(idOrSlug) {
        const hero = this.heroes.find((hero) => hero.id === idOrSlug || hero.slug === idOrSlug);
        if (!hero) {
            throw new common_1.NotFoundException('Hero not found');
        }
        return hero;
    }
    update(id, updateHeroDto) {
        const hero = this.findOne(id);
        return {
            ...hero,
            ...updateHeroDto,
        };
    }
    remove(id) {
        const hero = this.findOne(id);
        this.heroes = this.heroes.filter((hero) => hero.id !== id);
        return hero;
    }
    getHeroSummary() {
        const heroes = this.heroes;
        const totalHeroes = heroes.length;
        const strongestHero = heroes.reduce((max, hero) => hero.strength > max.strength ? hero : max);
        const smartestHero = heroes.reduce((max, hero) => hero.intelligence > max.intelligence ? hero : max);
        const heroCount = heroes.reduce((acc, hero) => {
            if (hero.category === 'Hero') {
                return acc + 1;
            }
            return acc;
        }, 0);
        const villainCount = heroes.reduce((acc, hero) => {
            if (hero.category === 'Villain') {
                return acc + 1;
            }
            return acc;
        }, 0);
        return {
            totalHeroes,
            strongestHero,
            smartestHero,
            heroCount,
            villainCount,
        };
    }
    findByAdvancedSearch(advancedSearchDto) {
        const { name, team, category, universe, status, strength } = advancedSearchDto;
        if (!name && !team && !category && !universe && !status && !strength) {
            throw new common_1.BadRequestException('At least one search parameter is required');
        }
        let filteredHeroes = [...this.heroes];
        if (name) {
            filteredHeroes = filteredHeroes.filter((hero) => hero.name.toLowerCase().includes(name.toLowerCase()) ||
                hero.alias.toLowerCase().includes(name.toLowerCase()));
        }
        if (team) {
            filteredHeroes = filteredHeroes.filter((hero) => hero.team.toLowerCase().includes(team.toLowerCase()));
        }
        if (category) {
            filteredHeroes = filteredHeroes.filter((hero) => hero.category.toLowerCase().includes(category.toLowerCase()));
        }
        if (universe) {
            filteredHeroes = filteredHeroes.filter((hero) => hero.universe.toLowerCase().includes(universe.toLowerCase()));
        }
        if (status) {
            filteredHeroes = filteredHeroes.filter((hero) => hero.status.toLowerCase().includes(status.toLowerCase()));
        }
        if (strength) {
            filteredHeroes = filteredHeroes.filter((hero) => hero.strength >= strength);
        }
        return filteredHeroes.sort((a, b) => a.name.localeCompare(b.name));
    }
};
exports.HeroesService = HeroesService;
exports.HeroesService = HeroesService = __decorate([
    (0, common_1.Injectable)()
], HeroesService);
//# sourceMappingURL=heroes.service.js.map