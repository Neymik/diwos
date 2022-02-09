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
import { Logger, UseGuards, Request } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WorldService } from './world.service';
import { WorldStateService } from './worldState/worldState.service';
import { SocketAuthGuard } from 'src/auth/guards/socketAuth.guard';

@WebSocketGateway({
  allowEIO3: true,
  // cors: {
  //   origin: true,
  //   credentials: true
  // },
})
export class WorldGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly worldService: WorldService,
    private readonly worldStateService: WorldStateService
  ) {}
  @WebSocketServer() 
  clients: Array<Socket>;
  server: Server;

  private logger: Logger = new Logger('WorldGateway');


  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('chatMessage')
  chatMessageHandle(
    @Request() req,
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    data.text = req.user.username + ': ' + data.text;
    this.broadcastMessage('chatMessage', data);
  }


  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('message')
  async handleMessage2(
    @Request() req,
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {

    let world = await this.worldService.getCache('world');

    world.data = this.worldService.testWorldPayloadProcess(req.user, world.data, data);

    this.worldService.setCache('world', world);
    this.broadcastMessage('world', world);

  }


  async afterInit(server: Server) {
    this.clients = [];

    const startWorld = await this.worldStateService.getLast();
    this.worldService.setCache('world', startWorld);

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


  async handleConnection(client: Socket, ...args: any[]) {
    client.send('hi', 'hi');
    this.clients.push(client);
    this.logger.log(`Client connected: ${client.id}`);

    let world = await this.worldService.getCache('world');
    this.broadcastMessage('world', world);
  }
  

  broadcastMessage(event: string, payload: any) {
    for (const client of this.clients) {
      client.emit(event, payload);
    }
  }
}
