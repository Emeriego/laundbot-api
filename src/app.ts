import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import config from "./config";
import AppDataSource from "./data-source";
import authRoute  from "./routes/auth.route";
import shopRoute  from "./routes/shop.route";
import itemRoutes from "./routes/item.route";
import customerRoute  from "./routes/customer.route";
import orderRoutes from "./routes/order.route";
import packageRoutes from "./routes/package.route";
import treatmentRoutes from "./routes/treatment.route";
import userRoutes from "./routes/user.route";

import swaggerSpec from "./swaggerConfig";
import logger from "./utils/logger";
dotenv.config();

const port = config.port;
const server: Express = express();
server.options("*", cors());
server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  }),
);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req: Request, res: Response) => {
  res.send({ message: "I am the laundbot API" });
});
server.get("/api", (req: Request, res: Response) => {
  res.json({ message: "I am the laundbot API waiting for requests" });
});

server.use("/api", authRoute);
server.use("/api", customerRoute);
server.use("/api", shopRoute);
server.use("/api", itemRoutes);
server.use("/api", orderRoutes);
server.use("/api", packageRoutes);
server.use("/api", treatmentRoutes);
server.use("/api", userRoutes);

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

AppDataSource.initialize()
  .then(async () => {
    server.listen(port, () => {
      logger.info(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => console.error(error));

export default server;
