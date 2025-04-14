import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SignalingModule } from './signaling/signaling.module';
import { HealthController } from './health/health.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SignalingModule, ConfigModule.forRoot({
    isGlobal: true,
  }),],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
