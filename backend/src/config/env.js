import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});

export const env = {
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  publicBaseUrl: process.env.PUBLIC_BASE_URL || "",
  assetBaseUrl: process.env.ASSET_BASE_URL || "",
  serveFrontend: process.env.SERVE_FRONTEND === "true",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  mysql: {
    host: process.env.MYSQL_HOST || "",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || ""
  }
};
