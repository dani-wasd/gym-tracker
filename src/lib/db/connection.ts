import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas";

// Opening a connection costs over a second, so keep one client alive across
// hot reloads in dev and across requests on a warm server instance.
const globalForDb = globalThis as unknown as { pgClient?: ReturnType<typeof postgres> };

const client =
  globalForDb.pgClient ??
  postgres(process.env.DATABASE_URL!, {
    // DATABASE_URL points at Supabase's transaction pooler, which can't keep
    // prepared statements between queries.
    prepare: false,
  });

globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
