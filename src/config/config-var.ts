export const configVar = () => ({
  ENABLE_EXPERIMENTAL_COREPACK: process.env.ENABLE_EXPERIMENTAL_COREPACK,
  PORT: Number(process.env.PORT) || 3000,
  LOGGER_LEVEL: process.env.LOGGER_LEVEL,
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
  SECRET: process.env.SECRET,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  FILES_DURATION: Number(process.env.FILES_DURATION) || 60,
});
