import {
  WebSocketGateway,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JanusProxyService } from './janus-proxy.service';
import WebSocket from 'ws';

/**
 * WebSocket gateway responsible for handling client connections
 * and delegating them to the Janus proxy.
 *
 * This gateway is the main entry point for all WebSocket clients.
 * For each incoming connection, a corresponding proxy to the
 * Janus Gateway is created via the JanusProxyService.
 */
@WebSocketGateway()
export class SignalingGateway implements OnGatewayConnection {
  private readonly logger = new Logger(SignalingGateway.name);

  constructor(private readonly janusProxy: JanusProxyService) {}

  /**
   * Triggered when a new WebSocket client connects.
   * Logs the connection and initiates a proxy to Janus.
   *
   * @param client - The connected WebSocket client.
   */
  handleConnection(@ConnectedSocket() client: WebSocket) {
    const remoteAddress = (client as any)?._socket?.remoteAddress;
    this.logger.log(`[ws] Client connected from ${remoteAddress}`);
    this.janusProxy.connectToJanus(client);
  }
}