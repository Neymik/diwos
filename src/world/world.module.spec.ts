import { Test, TestingModule } from '@nestjs/testing';
import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";

describe("my awesome project", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      clientSocket = io(`http://server.diwos.ru/`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("t1", (done) => {
    clientSocket.on("world", (arg) => {
      console.log(arg);
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

});