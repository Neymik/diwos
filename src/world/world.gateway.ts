import {
SubscribeMessage,
WebSocketGateway,
OnGatewayInit,
WebSocketServer,
OnGatewayConnection,
OnGatewayDisconnect,
MessageBody,
ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WorldService } from './world.service';

@WebSocketGateway({
  allowEIO3: true,
  // cors: {
  //   origin: true,
  //   credentials: true
  // },
})
export class WorldGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly worldService: WorldService) {}
  @WebSocketServer() 
  clients: any;
  server: Server;

  private logger: Logger = new Logger('WorldGateway');

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log(data)
    return data;
  }
  
  @SubscribeMessage('msgToClient')
  handleMessage(client: Socket, payload: string): void {
    console.log(payload);
    client.send('msgToClient', payload);
  }

  @SubscribeMessage('message')
  async handleMessage2(client: Socket, payload: any): Promise<void> {
    console.log('worldworldworldworldworldworldworldworldworldworldworld');
    console.log(payload);

    let world = await this.worldService.getCache('world');

    world = this.worldService.testWorldPayloadProcess(world, payload);

    this.worldService.setCache('world', world);
    this.broadcastMessage('world', world);

  }

  async afterInit(server: Server) {
    this.clients = [];

    const defWorld = [
        {
            obj_id: 1,
            obj_x: 17,
            obj_y: 14,
            obj_size: 50,
            obj_pic: 'http://server.diwos.ru/images/cat.gif'
        }
    ];

    this.worldService.setCache('world', defWorld);
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i] === client) {
        this.clients.splice(i, 1);
        break;
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.send('hi', 'hi');
    this.clients.push(client);
    this.logger.log(`Client connected: ${client.id}`);
  }

  broadcastMessage(event: string, payload: any) {
    for (const client of this.clients) {
      client.emit(event, payload);
    }
  }
}
