require("dotenv").config({ path: "./.env" });

const PORT = process.env.PORT || 3003;

module.exports = {
  apps: [
    {
      script: "bun", // Cambiado a dist/main.js
      args: "start",
      // cwd: process.cwd(),
      // instances: 1,

      exec_mode: "cluster",
      watch: ["dist"],
      // ignore_watch: ["node_modules", "src"],
      env: {
        NODE_ENV: "production",
        PORT: PORT,
        ENABLE_EXPERIMENTAL_COREPACK: process.env.ENABLE_EXPERIMENTAL_COREPACK,
        LOGGER_LEVEL: process.env.LOGGER_LEVEL,
        MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
        CDN_URL: process.env.CDN_URL,
        SECRET: process.env.SECRET,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
        FILES_DURATION: process.env.FILES_DURATION,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT,
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        REDIS_DB: process.env.REDIS_DB,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
        AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
      },
      env_development: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      node_args: "--max-old-space-size=4096",
      error_file: "logs/error.log",
      out_file: "logs/output.log",
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      kill_timeout: 5000,
      // wait_ready: true,
      listen_timeout: 50000,
    },
  ],
};
