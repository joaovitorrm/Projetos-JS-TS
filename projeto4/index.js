import express from 'express';
import path from 'node:path';

const app = express();
const __dirname = import.meta.dirname;
const port = 3000;

app.use(express.static("./public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});