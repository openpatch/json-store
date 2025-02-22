import fs from "fs/promises";
import express from "express";
import { nanoid } from "nanoid";
import favicon from "serve-favicon";
import * as path from "path";

const LOCAL = process.env.NODE_ENV !== "production";
const FOLDER_NAME =
  process.env.FOLDER_NAME || path.join(__dirname, "json-store");

const app = express();
app.use(express.json());

app.use(favicon(path.join(__dirname, "favicon.ico")));
app.get("/", (req, res) => res.sendFile(`${process.cwd()}/index.html`));

app.get("/api/v2/:key", async (req, res) => {
  try {
    const key = req.params.key;
    res.status(200);
    res.setHeader("content-type", "application/octet-stream");
    res.sendFile(path.join(FOLDER_NAME, key + ".json"));
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Could not find the file." });
  }
});

app.post("/api/v2/post/", async (req, res) => {
  try {
    const id = nanoid();
    const content = req.body;
    await fs.writeFile(
      path.join(FOLDER_NAME, id + ".json"),
      JSON.stringify(content)
    );

    res.status(200).json({
      id,
      data: `${LOCAL ? "http" : "https"}://${req.get("host")}/api/v2/${id}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not upload the data." });
  }
});

async function start() {
  await fs.mkdir(FOLDER_NAME).catch((error) => {
    if (error.code !== "EEXIST") {
      throw error;
    }
  });
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`http://localhost:${port}`));
}

start();
