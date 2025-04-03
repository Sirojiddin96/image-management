import sqlite3 from "sqlite3";
sqlite3.verbose();

console.log("Connecting to SQLite database...");

// Connecting to or creating a new SQLite database file
const sqlDB = new sqlite3.Database(
  "./collection.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    console.log('Error:', err);
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
  }
);


// // Function to insert a new item into the collection
// export const insertItem = (item) => {
//   const { name, description, image, price, quantity } = item;
//   const sql = `INSERT INTO collection (image) VALUES (?)`;
//   sqlDB.run(sql, [name, description, image, price, quantity], function (err) {
//     if (err) {
//       console.error("Error inserting item:", err.message);
//     } else {
//       console.log("Item inserted with ID:", this.lastID);
//     }
//   });
// };
// // Function to retrieve all items from the collection
// export const getItems = (callback) => {
//   const sql = `SELECT * FROM collection`;
//   sqlDB.all(sql, [], (err, rows) => {
//     if (err) {
//       console.error("Error retrieving items:", err.message);
//       callback(err, null);
//     } else {
//       callback(null, rows);
//     }
//   });
// };

// Serialize method ensures that database queries are executed sequentially
sqlDB.serialize(() => {
  // Create a new table if it doesn't exist
  sqlDB.run(
    `CREATE TABLE IF NOT EXISTS collection (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Table created or already exists.");
      }
    }
  );
  // Insert a new item into the collection
  const insertItem = `INSERT INTO collection (image) VALUES (?)`;
  sqlDB.run(insertItem, (err) => {
    if (err) {
      console.error("Error inserting item:", err.message);
    } else {
      console.log("Item inserted successfully.");
    }
  });
  // Retrieve all items from the collection
  const getItems = `SELECT * FROM collection`;
  sqlDB.all(getItems, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving items:", err.message);
    } else {
      console.log("Items retrieved successfully:", rows);
    }
  });

  // Close the database connection
  sqlDB.close((err) => {
    if (err) {
      console.error("Error closing the database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
