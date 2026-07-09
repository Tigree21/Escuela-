const { DatabaseSync } = require('node:sqlite');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite'));
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');
db.exec('PRAGMA busy_timeout = 5000');

const query = (sql, params = []) => {
  const upper = sql.trim().toUpperCase();
  const isSelect = upper.startsWith('SELECT') || upper.startsWith('WITH') || upper.startsWith('PRAGMA');

  if (isSelect) {
    const stmt = db.prepare(sql);
    return { rows: stmt.all(...params) };
  }

  const stmt = db.prepare(sql);
  const result = stmt.run(...params);
  return {
    rows: result.changes > 0 ? [{ id: Number(result.lastInsertRowid) }] : [],
    lastInsertRowid: Number(result.lastInsertRowid),
    changes: result.changes,
  };
};

const get = (sql, params = []) => {
  const stmt = db.prepare(sql);
  return stmt.get(...params);
};

const all = (sql, params = []) => {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
};

const run = (sql, params = []) => {
  const stmt = db.prepare(sql);
  const result = stmt.run(...params);
  return {
    lastInsertRowid: Number(result.lastInsertRowid),
    changes: result.changes,
  };
};

module.exports = { query, get, all, run, db };
