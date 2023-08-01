require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

// Create a connection to the MySQL database
const connection = mysql.createConnection(process.env.DATABASE_URL);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database");
  }
});

app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  })
);
app.use(express.json());

// Cards endpoints
app.get("/cards/:collectionId", (req, res) => {
  const collectionId = req.params.collectionId;

  connection.query(
    "SELECT * FROM cards WHERE collectionId = ?",
    [collectionId],
    (err, results) => {
      if (err) {
        console.error("Error getting cards from database:", err);
        res.status(500).send("Internal server error");
      } else {
        res.json(results);
      }
    }
  );
});

app.post("/cards", (req, res) => {
  const { collectionId, frontContent, backContent } = req.body;

  if (
    frontContent.trim() === "" ||
    backContent.trim() === "" ||
    frontContent.length < 2 ||
    frontContent.length > 10 ||
    backContent.length < 2 ||
    backContent.length > 10
  ) {
    console.error("Content is invalid. Please check your data.");
    res.status(400).send("Bad Request");
  } else {
    connection.query(
      "INSERT INTO cards (collectionId, frontContent, backContent) VALUES (?, ?, ?)",
      [collectionId, frontContent, backContent],
      (err, result) => {
        if (err) {
          console.error("Error creating card in database:", err);
          res.status(500).send("Internal server error");
        } else {
          const newCard = {
            id: result.insertId,
            collectionId,
            frontContent,
            backContent,
          };
          res.status(201).json(newCard);
        }
      }
    );
  }
});

app.put("/cards/:id", (req, res) => {
  const id = req.params.id;
  const { collectionId, frontContent, backContent } = req.body;
  if (
    frontContent.trim() === "" ||
    backContent.trim() === "" ||
    frontContent.length < 2 ||
    frontContent.length > 10 ||
    backContent.length < 2 ||
    backContent.length > 10
  ) {
    console.error("Content is invalid. Please check your data.");
    res.status(400).send("Bad Request");
  } else {
    connection.query(
      "UPDATE cards SET collectionId = ?, frontContent = ?, backContent = ? WHERE id = ?",
      [collectionId, frontContent, backContent, id],
      (err, result) => {
        if (err) {
          console.error("Error updating card in database:", err);
          res.status(500).send("Internal server error");
        } else if (result.affectedRows === 0) {
          res.status(404).send("Card not found");
        } else {
          res.sendStatus(204);
        }
      }
    );
  }
});

app.delete("/cards/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM cards WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting card from database:", err);
      res.status(500).send("Internal server error");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Card not found");
    } else {
      res.sendStatus(204);
    }
  });
});

// collections endpoints
app.get("/collections", (req, res) => {
  connection.query("SELECT * FROM collections", (err, results) => {
    if (err) {
      console.error("Error getting collections from database:", err);
      res.status(500).send("Internal server error");
    } else {
      res.json(results);
    }
  });
});

app.post("/collections", (req, res) => {
  const { name } = req.body;
  if (name.trim() === "" || name.length < 3 || name.length > 18) {
    console.error("Name is invalid. Please check your data.");
    res.status(400).send("Bad Request");
  } else {
    connection.query(
      "INSERT INTO collections (name) VALUES (?)",
      [name],
      (err, result) => {
        if (err) {
          console.error("Error creating collection in database:", err);
          res.status(500).send("Internal server error");
        } else {
          const newCollection = {
            id: result.insertId,
            name,
          };
          res.status(201).json(newCollection);
        }
      }
    );
  }
});

app.put("/collections/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  if (name.trim() === "" || name.length < 3 || name.length > 18) {
    console.error("Name is invalid. Please check your data.");
    res.status(400).send("Bad Request");
  } else {
    connection.query(
      "UPDATE collections SET name = ? WHERE id = ?",
      [name, id],
      (err, result) => {
        if (err) {
          console.error("Error updating collection in database:", err);
          res.status(500).send("Internal server error");
        } else if (result.affectedRows === 0) {
          res.status(404).send("Collection not found");
        } else {
          res.sendStatus(204);
        }
      }
    );
  }
});

app.delete("/collections/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "DELETE FROM collections WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting collection from database:", err);
        res.status(500).send("Internal server error");
      } else if (result.affectedRows === 0) {
        res.status(404).send("Collection not found");
      } else {
        res.sendStatus(204);
      }
    }
  );
});

app.delete("/collections/:id/cards", (req, res) => {
  const collectionId = req.params.id;
  connection.query(
    "DELETE FROM cards WHERE collectionId = ?",
    [collectionId],
    (err, resultes) => {
      if (err) {
        console.error("Error deleting cards from database:", err);
        res.status(500).send("Internal server error");
      } else {
        res.sendStatus(204);
      }
    }
  );
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
