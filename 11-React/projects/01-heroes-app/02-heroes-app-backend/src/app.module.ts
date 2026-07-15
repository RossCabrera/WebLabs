import { join } from 'path';

import { Module } from '@nestjs/common';
import { HeroesModule } from './heroes/heroes.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    HeroesModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
