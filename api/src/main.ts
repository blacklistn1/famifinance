import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

(async function () {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'session',
      resave: false,
      saveUninitialized: true,
    }),
  );
  await app.listen(3000);
})();
