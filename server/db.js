import { Pool } from "pg";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const isPostgres = Boolean(process.env.DATABASE_URL);

function toPgPlaceholders(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => {
    i += 1;
    return `$${i}`;
  });
}

async function initPostgres(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      time TEXT,
      location TEXT,
      duration TEXT,
      level TEXT,
      type TEXT NOT NULL CHECK (type IN ('featured', 'upcoming')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      message TEXT,
      seminar_id INTEGER NOT NULL REFERENCES events(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      approved_at TIMESTAMPTZ,
      UNIQUE(email, seminar_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  await pool.query(
    `INSERT INTO admins (username, password)
     VALUES ('admin', 'admin123')
     ON CONFLICT (username) DO NOTHING;`
  );
}

function initSqlite(sqliteDb) {
  sqliteDb.serialize(() => {
    sqliteDb.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      time TEXT,
      location TEXT,
      duration TEXT,
      level TEXT,
      type TEXT CHECK(type IN ('featured', 'upcoming')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    sqliteDb.run(`CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      message TEXT,
      seminar_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(email, seminar_id),
      FOREIGN KEY (seminar_id) REFERENCES events(id)
    )`);

    sqliteDb.all("PRAGMA table_info(registrations)", (err, columns) => {
      if (err) return;
      const columnNames = new Set((columns || []).map((col) => col?.name));
      if (!columnNames.has("approved_at")) {
        sqliteDb.run("ALTER TABLE registrations ADD COLUMN approved_at DATETIME", () => {});
      }
    });

    sqliteDb.run(`CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    sqliteDb.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);

    sqliteDb.get("SELECT * FROM admins WHERE username = 'admin'", (err, row) => {
      if (err) return;
      if (!row) {
        sqliteDb.run("INSERT INTO admins (username, password) VALUES ('admin', 'admin123')");
      }
    });
  });
}

let db;

if (isPostgres) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.PGSSLMODE === "disable"
        ? undefined
        : {
            rejectUnauthorized: false,
          },
  });

  const ready = initPostgres(pool);

  db = {
    engine: "postgres",
    ready,
    async all(sql, params = [], cb) {
      try {
        await ready;
        const result = await pool.query(toPgPlaceholders(sql), params);
        cb?.(null, result.rows);
        return result.rows;
      } catch (err) {
        cb?.(err);
        throw err;
      }
    },
    async get(sql, params = [], cb) {
      try {
        await ready;
        const result = await pool.query(toPgPlaceholders(sql), params);
        const row = result.rows[0];
        cb?.(null, row);
        return row;
      } catch (err) {
        cb?.(err);
        throw err;
      }
    },
    async run(sql, params = [], cb) {
      try {
        await ready;
        const normalizedSql = toPgPlaceholders(sql);

        const wantsLastId = /^\s*insert\b/i.test(sql);
        const wantsRowCount = /\bupdate\b|\bdelete\b/i.test(sql);
        const returningSql = wantsLastId && !/\breturning\b/i.test(sql) ? `${normalizedSql} RETURNING id` : normalizedSql;
        const result = await pool.query(returningSql, params);

        const ctx = {
          lastID: wantsLastId ? result.rows?.[0]?.id ?? null : null,
          changes: wantsRowCount ? result.rowCount ?? 0 : result.rowCount ?? 0,
        };

        cb?.call(ctx, null);
        return ctx;
      } catch (err) {
        cb?.call({}, err);
        throw err;
      }
    },
  };
} else {
  const sqlite3Module = await import("sqlite3");
  const sqlite3 = sqlite3Module.default;
  const dbPath = path.resolve(__dirname, "..", "database.sqlite");
  const sqliteDb = new sqlite3.Database(dbPath);
  initSqlite(sqliteDb);
  db = sqliteDb;
  db.engine = "sqlite";
  db.ready = Promise.resolve();
}

export default db;
