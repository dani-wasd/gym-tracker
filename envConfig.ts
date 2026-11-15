// Loads .env.local the same way Next does, for scripts that run outside Next (drizzle-kit).
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
