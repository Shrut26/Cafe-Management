const dotenv = require("dotenv");
const http = require("http");
const app = require("./index");

const server = http.createServer(app);
dotenv.config();

server.listen(process.env.PORT);
