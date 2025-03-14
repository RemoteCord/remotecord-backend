export default {
  apps: [{
    name: "remotecord-api",
    script: "./dist/main.js",
    instances: "max",
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development",
      PORT: 3003
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3003
    },
    source_map_support: true,
    node_args: [
      "--experimental-specifier-resolution=node",
      "--loader=ts-node/esm"
    ]
  }]
}
