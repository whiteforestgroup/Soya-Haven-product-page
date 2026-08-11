import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "..", "data.sqlite3");

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS checkout_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stripe_session_id TEXT UNIQUE,
    email TEXT NOT NULL,
    cart_json TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'started', -- started | completed | expired | abandoned_notified
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    completed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    checkout_session_id INTEGER REFERENCES checkout_sessions(id),
    stripe_payment_intent_id TEXT,
    email TEXT NOT NULL,
    cart_json TEXT NOT NULL,
    total_amount REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL DEFAULT 'unknown', -- checkout | popup | etc.
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Records every automated email we've sent, so the periodic sweep never
  -- sends the same step twice. reference_id scopes a step to a specific
  -- checkout/order/subscriber/winback-cycle (see jobs/automations.js).
  CREATE TABLE IF NOT EXISTS automation_sends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flow TEXT NOT NULL,
    step INTEGER NOT NULL,
    email TEXT NOT NULL,
    reference_id TEXT NOT NULL,
    sent_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(flow, step, email, reference_id)
  );

  -- Anyone who has clicked "unsubscribe" — checked before every automated
  -- send, regardless of which flow. CAN-SPAM requires this to actually work.
  CREATE TABLE IF NOT EXISTS email_suppressions (
    email TEXT PRIMARY KEY,
    suppressed_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- One row per page load, recorded by the frontend on mount. Simple
  -- own-data view counter for the admin dashboard — not a replacement for
  -- Meta/GA-level analytics, just a quick "how many people are visiting."
  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    visitor_id TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Single-row status record, overwritten every time the 15-minute email
  -- automation sweep runs — lets the admin dashboard show "last checked N
  -- minutes ago" instead of that being invisible/unverifiable.
  CREATE TABLE IF NOT EXISTS automation_runs (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    last_run_at TEXT NOT NULL,
    last_sent_count INTEGER NOT NULL
  );
`);

// Lightweight migration for columns added after page_views already existed
// in production — CREATE TABLE IF NOT EXISTS above won't add columns to an
// already-existing table, so patch them in if missing.
function ensureColumn(table, column, definition) {
  const existing = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
  if (!existing.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}
ensureColumn("page_views", "visitor_id", "TEXT");
ensureColumn("page_views", "utm_source", "TEXT");
ensureColumn("page_views", "utm_medium", "TEXT");
ensureColumn("page_views", "utm_campaign", "TEXT");
ensureColumn("page_views", "referrer", "TEXT");
