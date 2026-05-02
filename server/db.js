import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Events table
  db.run(`CREATE TABLE IF NOT EXISTS events (
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

  // Seminar registrations table
  db.run(`CREATE TABLE IF NOT EXISTS registrations (
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

  db.all("PRAGMA table_info(registrations)", (err, columns) => {
    if (err) return;
    const columnNames = new Set((columns || []).map((col) => col?.name));
    if (!columnNames.has("approved_at")) {
      db.run("ALTER TABLE registrations ADD COLUMN approved_at DATETIME", () => {});
    }
  });

  // Contact inquiries table
  db.run(`CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Admin users table (simple version)
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  // Insert a default admin if not exists (username: admin, password: admin123 - in a real app, use hashing)
  db.get("SELECT * FROM admins WHERE username = 'admin'", (err, row) => {
    if (!row) {
      db.run("INSERT INTO admins (username, password) VALUES ('admin', 'admin123')");
    }
  });
});

export default db;
