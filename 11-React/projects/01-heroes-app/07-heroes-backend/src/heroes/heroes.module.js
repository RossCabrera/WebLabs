"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroesModule = void 0;
const common_1 = require("@nestjs/common");
const heroes_service_1 = require("./heroes.service");
const heroes_controller_1 = require("./heroes.controller");
let HeroesModule = class HeroesModule {
};
exports.HeroesModule = HeroesModule;
exports.HeroesModule = HeroesModule = __decorate([
    (0, common_1.Module)({
        controllers: [heroes_controller_1.HeroesController],
        providers: [heroes_service_1.HeroesService],
    })
], HeroesModule);
//# sourceMappingURL=heroes.module.js.map