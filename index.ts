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
    const filePath = path.join(FOLDER_NAME, key + ".json");
    const content = await fs.readFile(filePath, "utf-8");

    let data;
    try {
      data = JSON.parse(content);
    } catch (parseError) {
      // If not valid JSON, return the raw content
      res.status(200);
      res.setHeader("content-type", "application/octet-stream");
      return res.send(content);
    }

    // Remove password field if it exists
    if (data.password) {
      delete data.password;
    }

    res.status(200);
    res.setHeader("content-type", "application/json");
    res.json(data);
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

app.post("/api/v2/post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filePath = path.join(FOLDER_NAME, id + ".json");
    const newContent = req.body;

    // Check if file exists
    let existingContent;
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      existingContent = JSON.parse(fileContent);
    } catch (error) {
      return res.status(404).json({ message: "Could not find the file." });
    }

    // Check if password exists in the stored file
    if (!existingContent.password) {
      return res
        .status(403)
        .json({ message: "This file is not password protected." });
    }

    // Check if password was provided in request
    if (!newContent.password) {
      return res.status(401).json({ message: "Password is required." });
    }

    // Validate password
    if (existingContent.password !== newContent.password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Password is valid, replace the file
    await fs.writeFile(filePath, JSON.stringify(newContent));

    res.status(200).json({
      id,
      data: `${LOCAL ? "http" : "https"}://${req.get("host")}/api/v2/${id}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update the data." });
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
