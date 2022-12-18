import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { waktuShalat } from "./api/shalat.js";
import { yourLocation } from "./api/location.js";
import consola from "consola";

dotenv.config();

const server = express();
const allowOrigins = { origin: "*" };
const __dirname = dirname(fileURLToPath(import.meta.url));

server.use(express.static(path.join(__dirname, "/public")));
server.set(cors, allowOrigins);
server.set(bodyParser.json());
const urlEncodedParser = server.set(bodyParser.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

server.use(
  "/api/islamic/v1/:token/:country/:city/:page",
  cors(allowOrigins),
  waktuShalat
);

server.use(
  "/api/islamic/v1/location/:token/:key",
  cors(allowOrigins),
  yourLocation
);

server.listen(process.env.PORT, () => {
  consola.ready(
    `Server is now running on http://localhost:${process.env.PORT}`
  );
});
