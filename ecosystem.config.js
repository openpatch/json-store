module.exports = {
  apps: [
    {
      name: "json-store",
      script: "index.js",
      watch: ".",
      env: {
        NODE_ENV: "development",
      },
      env_producation: {
        NODE_ENV: "producation",
        PORT: 3000,
      },
    },
  ],
};
