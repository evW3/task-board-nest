import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './domains/roles/roles.model';
import { Users } from './domains/users/users.model';
import { Permissions } from './domains/roles/permissions.model';
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';
import { RolesModule } from './domains/roles/roles.module';
import { WorkplacesModule } from './domains/workplaces/workplaces.module';
import { Projects } from './domains/projects/projects.model';
import { Workplaces } from './domains/workplaces/workplaces.model';
import { ProjectsModule } from './domains/projects/projects.module';
import { RouterModule } from 'nest-router';
import { WorkplacesRoute } from './routes/workplaces.route';
import { Lists } from './domains/lists/lists.model';
import { ListsModule } from './domains/lists/lists.module';
import { Cards } from './domains/cards/cards.model';
import { CardsActivities } from './domains/cards/cardsActivities.model';
import { CardsAttachments } from './domains/cards/cardsAttachments.model';
import { CardsModule } from './domains/cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.${ process.env.NODE_ENV }.env`, '.env']
    }),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number.parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      logging: false,
      database: process.env.POSTGRES_DB,
      migrations: ["src/migration/*.js"],
      entities: [
        Users,
        Roles,
        Permissions,
        Workplaces,
        Projects,
        Lists,
        Cards,
        CardsActivities,
        CardsAttachments
      ],
      cli: {
        migrationsDir: "migration"
      }
    }),
    RouterModule.forRoutes(WorkplacesRoute),
    AuthModule,
    UsersModule,
    RolesModule,
    WorkplacesModule,
    ProjectsModule,
    ListsModule,
    CardsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}