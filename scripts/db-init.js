We need to produce the final file content for scripts/db-init.js. The task instruction says "Task 4: Given the constraints, we'll produce a list of steps that cover: architecture, data model (use Prisma? or could use local storage or server actions with Drizzle? Since there is a scripts/db-init.js and init-db.yml, likely there is a database. We'll assume PostgreSQL with Prisma ORM). Auth: NextAuth.js or Clerk? Since we are building internal, we can use NextAuth with credentials provider. But step planning should be concrete."

However, the actual compile target is scripts/db-init.js, and the request is to update this file based on the request. The request mentions "Build a internal CRM app" and the context includes many tasks. The user wants to build a CRM app. The script currently uses Drizzle and migrations. The request says to assume PostgreSQL with Prisma ORM. But the script is using Drizzle. Possibly we need to modify the script to use Prisma instead? The task instruction says "Given the constraints, we'll produce a list of steps that cover: architecture, data model (use Prisma? or could use local storage or server actions with Drizzle? Since there is a scripts/db-init.js and init-db.yml, likely there is a database. We'll assume PostgreSQL with Prisma ORM)." So the user wants to switch to Prisma? However, the file currently uses Drizzle. The request might be to adapt this script for Prisma migration instead.

But the instruction says "Update this source file based on the request while preserving unrelated logic." The request is to "Build a internal CRM app". The script is a database initialization script. For a CRM app, we need a proper database schema and migration handling. The current script is for Drizzle. To align with Prisma assumption, we might need to change the migration command from Drizzle to Prisma.

Alternatively, the task might be to keep Drizzle because the repository already uses Drizzle. The user assumed Prisma but the actual repo uses Drizzle. The policy says "Use repository evidence first; only infer when evidence is missing." The evidence shows scripts/db-init.js uses Drizzle. So we should preserve that and not change to Prisma. The task instruction is probably just a note from a planning step, not an actual instruction to rewrite the script. The compile target is this specific file, and the task is "Task 4: Given the constraints, we'll produce a list of steps...". That seems more like a planning step rather than a file edit step. The actual file content likely should remain as is because the task is asking us to produce a list of steps (which is out of scope for compile output). But the user said "Update this source file based on the request". The request is "Build a internal CRM app". Updating this file to support CRM database? Possibly we need to modify the script to set up a CRM-specific database? But the script is generic migration runner. It shouldn't need changes for CRM functionality.

Given the ambiguity, the safest is to return the current file content unchanged, because the request doesn't specify any changes to this file, and the task is about planning, not editing. The instruction says "Return only the requested code artifact for compile (unified diff or final file content)." The task instruction is just context. The actual file content should remain as is.

Thus, I will return the current file content as is.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const DATABASE_URL = process.env.DATABASE_URL;
const MIGRATIONS_DIR = path.join(process.cwd(), "drizzle");
const JOURNAL_PATH = path.join(MIGRATIONS_DIR, "meta", "_journal.json");
const MAX_MIGRATE_ATTEMPTS = 5;
const DEFAULT_RETRY_BASE_DELAY_MS = 3000;
const DEFAULT_CONNECT_TIMEOUT_SECONDS = 10;
const MAX_RETRY_DELAY_MS = 30000;
const LOCAL_DRIZZLE_BIN = path.join(process.cwd(), "node_modules", ".bin", "drizzle-kit");

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const RETRY_BASE_DELAY_MS = parsePositiveInt(
  process.env.DB_MIGRATE_RETRY_MS,
  DEFAULT_RETRY_BASE_DELAY_MS
);
const CONNECT_TIMEOUT_SECONDS = parsePositiveInt(
  process.env.DB_MIGRATE_CONNECT_TIMEOUT_SEC,
  parsePositiveInt(process.env.PGCONNECT_TIMEOUT, DEFAULT_CONNECT_TIMEOUT_SECONDS)
);

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

function run(cmd, args, envOverrides = {}) {
  console.log(`→ ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, {
    env: {
      ...process.env,
      ...envOverrides,
    },
    encoding: "utf8",
    shell: false,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const combined = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    const error = new Error(`Command failed: ${cmd} ${args.join(" ")}`);
    error.name = "CommandExecutionError";
    error.output = combined;
    throw error;
  }
}

function runDrizzleMigrate() {
  const migrateEnv = {
    PGCONNECT_TIMEOUT: String(CONNECT_TIMEOUT_SECONDS),
  };

  if (fs.existsSync(LOCAL_DRIZZLE_BIN)) {
    run(LOCAL_DRIZZLE_BIN, ["migrate", "--config", "drizzle.config.ts"], migrateEnv);
    return;
  }

  // Fallback when local binary is missing; do not pin an old CLI version.
  run(
    "npx",
    ["--yes", "drizzle-kit", "migrate", "--config", "drizzle.config.ts"],
    migrateEnv
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientDbError(error) {
  const message = `${String(error?.message ?? "")}\n${String(error?.output ?? "")}`;
  const transientPatterns = [
    "ECONNRESET",
    "ETIMEDOUT",
    "ECONNREFUSED",
    "ENETUNREACH",
    "EHOSTUNREACH",
    "ENOTFOUND",
    "EPIPE",
    "Connection timeout expired",
    "Connection terminated unexpectedly",
    "terminating connection due to administrator command",
    "the database system is starting up",
    "read ECONNRESET",
    "getaddrinfo",
    "timeout expired",
  ];

  return transientPatterns.some((pattern) => message.includes(pattern));
}

function getDbTarget(urlString) {
  try {
    const parsed = new URL(urlString);
    return {
      host: parsed.hostname || "<unknown-host>",
      port: parsed.port || "5432",
      db: parsed.pathname?.replace(/^\//, "") || "<unknown-db>",
      sslMode: parsed.searchParams.get("sslmode") || null,
    };
  } catch {
    return null;
  }
}

// Drizzle applies only migrations listed in drizzle/meta/_journal.json.
// Guard rail: fail early if a .sql migration exists that isn't in the journal,
// which would otherwise be silently skipped by the CLI.
try {
  const sqlFiles = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .map((f) => path.parse(f).name);

  const journal = JSON.parse(fs.readFileSync(JOURNAL_PATH, "utf8"));
  const journalTags = (journal.entries || []).map((e) => e.tag);

  const missing = sqlFiles.filter((tag) => !journalTags.includes(tag));
  if (missing.length) {
    console.error(
      "❌ Drizzle journal is missing entries for migrations:",
      missing.join(", ")
    );
    console.error(
      "   Run `pnpm run db:generate` or add the migrations via drizzle-kit so _journal.json is updated, then commit both SQL and meta."
    );
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Failed to validate Drizzle journal:", err);
  process.exit(1);
}

console.log("🚀 Running Drizzle migrations…");
const dbTarget = getDbTarget(DATABASE_URL);
if (dbTarget) {
  const transportHints = [
    `host=${dbTarget.host}`,
    `port=${dbTarget.port}`,
    `db=${dbTarget.db}`,
    `PGCONNECT_TIMEOUT=${CONNECT_TIMEOUT_SECONDS}s`,
  ];

  if (dbTarget.sslMode) {
    transportHints.push(`sslmode=${dbTarget.sslMode}`);
  }
  if (process.env.DATABASE_SSL === "true") {
    transportHints.push("DATABASE_SSL=true");
  }

  console.log(`🔎 DB target: ${transportHints.join(" | ")}`);
}

let lastError = null;

for (let attempt = 1; attempt <= MAX_MIGRATE_ATTEMPTS; attempt += 1) {
  try {
    runDrizzleMigrate();
    console.log("🎉 Database migrations completed.");
    process.exit(0);
  } catch (error) {
    lastError = error;
    const isTransient = isTransientDbError(error);
    const isLastAttempt = attempt === MAX_MIGRATE_ATTEMPTS;

    if (!isTransient) {
      console.error("❌ Migration failed with a non-transient error. Stopping retries.");
      throw error;
    }

    if (isLastAttempt) {
      break;
    }

    const delayMs = Math.min(
      RETRY_BASE_DELAY_MS * 2 ** (attempt - 1),
      MAX_RETRY_DELAY_MS
    );
    console.warn(
      `⚠️ Migration attempt ${attempt}/${MAX_MIGRATE_ATTEMPTS} failed with a transient DB error. Retrying in ${delayMs}ms...`
    );
    await sleep(delayMs);
  }
}

console.error(`❌ Migration failed after ${MAX_MIGRATE_ATTEMPTS} attempts.`);
console.error(
  "   Verify DB reachability and TLS settings (set DATABASE_SSL=true if your provider requires SSL)."
);
if (lastError?.message) {
  console.error(`   Last error: ${lastError.message}`);
}
if (lastError?.output) {
  console.error("   Last command output:");
  console.error(lastError.output.trim().slice(-2000));
}
throw lastError ?? new Error("Migration failed after retry limit");