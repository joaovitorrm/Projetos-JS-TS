import express from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(express.static(join(__dirname, "public", "views")));

app.get("/", async (_req, res) => {
  res.sendFile(join(__dirname, "public", "views", "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
