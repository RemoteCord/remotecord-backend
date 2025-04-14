module.exports = {
  apps: [
    {
      name: "backend-1",
      script: "./dist/main.js",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
    },
    {
      name: "backend-2",
      script: "./dist/main.js",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3004,
      },
    },
  ],
};
