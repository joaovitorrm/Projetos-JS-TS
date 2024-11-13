import express from "npm:express@4.18.2";
import * as path from "jsr:@std/path";

const app = express();

app.use(express.static(path.join(Deno.cwd(), "public", "views")));

// deno-lint-ignore ban-ts-comment
// @ts-ignore
app.get("/", async (_req, res) => {
  res.sendFile(await Deno.realPath("./public/views/index.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
