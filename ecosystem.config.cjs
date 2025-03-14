module.exports = {
  apps: [{
    name: "remotecord-api",
    script: "./dist/main.js",
    instances: 1,
    exec_mode: "fork",
    env: {
      NODE_ENV: "development",
      PORT: 3003
    }
  }]
}
