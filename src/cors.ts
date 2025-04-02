import { type CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

const ALLOWED_ORIGINS: string[] = [
  "http://localhost:3007",
  "http://tauri.localhost",
];

const CorsOptions: CorsOptions = {
  origin: (origin, cb) => {
    console.log("aaaaaaaaaaaaaaa", origin); // Log even if undefined

    if (!origin) {
      // Handle requests with no origin (like same origin requests)
      cb(null, true);
      return;
    }

    try {
      const hostname = new URL(origin).hostname;
      console.log("Hostname: ", hostname, origin);

      if (ALLOWED_ORIGINS.includes(origin)) {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }

      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed"), false);
    } catch (error) {
      console.error("Error parsing origin:", error);
      cb(new Error("Invalid origin"), false);
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
  maxAge: 86400,
};

export { CorsOptions };
