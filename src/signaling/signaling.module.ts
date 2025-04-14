import { Module } from '@nestjs/common';
import { SignalingGateway } from './signaling.gateway';
import { JanusProxyService } from './janus-proxy.service';

@Module({
  providers: [SignalingGateway, JanusProxyService],
})
export class SignalingModule {}