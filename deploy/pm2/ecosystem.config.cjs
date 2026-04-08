module.exports = {
  apps: [
    {
      name: "ur-beauty-api",
      cwd: "./backend",
      script: "src/server.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    }
  ]
};
