import type { Server } from "node:http";
import type { ShutdownHook } from "@core/application/shutdown/ShutdownHook";

export class HttpServerShutdownHook implements ShutdownHook {
  public readonly name = "HttpServerShutdownHook";

  public constructor(private readonly server: Server) {}

  public async shutdown(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}