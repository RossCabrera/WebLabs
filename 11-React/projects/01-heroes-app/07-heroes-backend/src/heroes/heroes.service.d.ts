import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { Hero } from './entities/hero.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advande-search.dto';
export declare class HeroesService {
    private heroes;
    create(createHeroDto: CreateHeroDto): {
        id: string;
        slug: string;
        name: string;
        alias: string;
        powers: string[];
        description: string;
        strength: number;
        intelligence: number;
        speed: number;
        durability: number;
        team: string;
        image: string;
        firstAppearance: string;
        status: string;
        category: string;
        universe: string;
    };
    findAll(paginationDto: PaginationDto): {
        total: number;
        pages: number;
        heroes: Hero[];
    };
    findOne(idOrSlug: string): Hero;
    update(id: string, updateHeroDto: UpdateHeroDto): {
        name: string;
        slug: string;
        alias: string;
        powers: string[];
        description: string;
        strength: number;
        intelligence: number;
        speed: number;
        durability: number;
        team: string;
        image: string;
        firstAppearance: string;
        status: string;
        category: string;
        universe: string;
        id: string;
    };
    remove(id: string): Hero;
    getHeroSummary(): {
        totalHeroes: number;
        strongestHero: Hero;
        smartestHero: Hero;
        heroCount: number;
        villainCount: number;
    };
    findByAdvancedSearch(advancedSearchDto: AdvancedSearchDto): Hero[];
}
