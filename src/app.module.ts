import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DatabaseModule from './database/database.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import routes from './middleware/routes.middleware';
import TasksModule from './tasks/tasks.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, DatabaseModule, ConfigModule.forRoot(), TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(...routes);
  }
}
