import path from 'path';
import fs from 'fs';
import sqlite3 from "sqlite3";
sqlite3.verbose();

// Ensure the 'db' directory exists
const dbDir = path.join(process.cwd(), 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}
console.log(dbDir);

// Absolute path to the SQLite file
const dbPath = path.join(dbDir, 'collection.db');

// Connecting to or creating a new SQLite database file
const sqlDB = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error('❌ Failed to connect to SQLite DB:', err.message);
    } else {
      console.log('✅ Connected to the SQLite database at', dbPath);
    }
  }
);

// Serialize method ensures that database queries are executed sequentially
sqlDB.serialize(() => {

  // Create a new table if it doesn't exist
  sqlDB.run(
    `CREATE TABLE IF NOT EXISTS images (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             name TEXT,
             type TEXT,
             size INTEGER,
             compressedSize INTEGER,
             originalFile TEXT,
             compressedFile TEXT,
             uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
           )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Table created or already exists.");
      }
    }
  );
});

export default sqlDB;