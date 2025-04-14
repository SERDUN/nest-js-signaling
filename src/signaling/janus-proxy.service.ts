import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import WebSocket from 'ws';

/**
 * A service that proxies WebSocket messages between a client and the Janus Gateway.
 *
 * For every incoming WebSocket client connection, a corresponding connection
 * to the Janus Gateway is established. All messages are transparently
 * forwarded in both directions.
 *
 * This is useful when you want to abstract the signaling logic away from
 * your clients or control/monitor Janus traffic server-side.
 */
@Injectable()
export class JanusProxyService {
  private readonly janusUrl: string;
  private readonly janusProtocol: string;

  constructor(private readonly config: ConfigService) {
    this.janusUrl = this.config.get<string>('JANUS_GATEWAY_URL', 'ws://localhost:8188');
    this.janusProtocol = this.config.get<string>('JANUS_PROTOCOL', 'janus-protocol');
  }

  /**
   * Establishes a WebSocket connection to Janus Gateway and proxies all traffic
   * between the client and Janus.
   *
   * @param client - The incoming WebSocket connection from the client.
   */
  connectToJanus(client: WebSocket) {
    const janus = new WebSocket(this.janusUrl, this.janusProtocol);

    janus.on('open', () => {
      console.log('[janus] Connected to Janus');

      // Forward messages from client to Janus
      client.on('message', (msg) => {
        console.log('[client → janus]', msg.toString());
        janus.send(msg.toString());
      });

      // Forward messages from Janus to client
      janus.on('message', (msg) => {
        console.log('[janus → client]', msg.toString());
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(msg.toString());
          } catch (e) {
            console.error('[client.send] Failed:', e);
          }
        } else {
          console.warn('[client.send] client not open');
        }
      });
    });

    // Reconnect logic in case Janus connection fails
    janus.on('error', (err) => {
      console.error('[janus] Connection error:', err.message);
      setTimeout(() => this.connectToJanus(client), 3000); // retry
    });

    // Close the client connection if Janus connection is closed
    janus.on('close', () => {
      console.warn('[janus] Connection closed');
      client.close();
    });

    // Close the Janus connection if the client disconnects
    client.on('close', () => {
      console.log('[client] Connection closed');
      janus.close();
    });
  }
}
