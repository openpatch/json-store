module.exports = {
  apps: [
    {
      name: "json-store",
      script: "index.js",
      watch: ".",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
