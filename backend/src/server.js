import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectMySql } from "./config/mysql.js";

const listen = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));
    server.on("error", reject);
  });

const start = async () => {
  await connectMySql();

  let port = env.port;

  while (true) {
    try {
      await listen(port);
      console.log(`API running on http://localhost:${port}`);
      break;
    } catch (error) {
      if (error.code !== "EADDRINUSE") {
        throw error;
      }
      console.warn(`Port ${port} is in use, trying ${port + 1}...`);
      port += 1;
    }
  }
};

start();
