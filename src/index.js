import app from "./app.js";
import { config } from "dotenv";
import prisma from "./middleware/prisma.js";
import fs from "fs";
import https from "https";

config();
const PORT = 5500;

// const key = fs.readFileSync("src/certs/key.pem");
// const cert = fs.readFileSync("src/certs/cert.pem");

// const server = https.createServer({ key, cert }, app);

// server.listen(PORT || 5500, () =>
//   console.log(`Server running in port "${PORT}"`)
// );
// Connections Begin

app.listen(PORT || 5500, () => console.log(`Server running in port "${PORT}"`));

process.on("SIGINT", () => {
  prisma.$disconnect();
  console.log("Prisma Disconnected.");
  process.exit(0);
  
});

// Connections End
