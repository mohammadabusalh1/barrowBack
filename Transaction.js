const express = require("express");
const con = require("./database/conection");
const Joi = require("joi");
const router = express.Router();

router.use(express.json());

// Joi schema for validation
const transactionItemSchema = Joi.object({
  ID: Joi.number().required(),
  CategoryName: Joi.string().required(),
  DeviceName: Joi.string().required(),
  DueDate: Joi.date().required(),
  CheckInDate: Joi.date().allow(null),
  Notes: Joi.string().allow(""),
  ReturnText: Joi.boolean(),
  Penalty: Joi.number().min(0),
  DamagedPenalty: Joi.number().min(0),
  Deduction: Joi.number().min(0),
  Comments: Joi.string().allow(""),
  Test: Joi.string().allow(""),
  CourseID: Joi.number().required(),
});

// Create a new TransactionItem
router.post("/transaction-items", (req, res) => {
  const { error } = transactionItemSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newItem = req.body;

  con.query("INSERT INTO transactionitem SET ?", newItem, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error creating TransactionItem" });
    }

    return res
      .status(201)
      .json({ message: "TransactionItem created successfully" });
  });
});

// Read all TransactionItems
router.get("/transaction-items", (req, res) => {
  con.query("SELECT * FROM TransactionItem", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching TransactionItems" });
    }

    return res.status(200).json(rows);
  });
});

// Read a specific transactionitem by ID
router.get("/transaction-items/:id", (req, res) => {
  const transactionItemID = req.params.id;

  con.query(
    "SELECT * FROM transactionitem WHERE ID = ?",
    [transactionItemID],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error fetching TransactionItem" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "TransactionItem not found" });
      }

      return res.status(200).json(rows[0]);
    }
  );
});

// Update a specific transactionitem by ID
router.put("/transaction-items/:id", (req, res) => {
  const transactionItemID = req.params.id;
  const { error } = transactionItemSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const updatedItem = req.body;

  con.query(
    "UPDATE transactionitem SET ? WHERE ID = ?",
    [updatedItem, transactionItemID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error updating TransactionItem" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "TransactionItem not found" });
      }

      return res
        .status(200)
        .json({ message: "TransactionItem updated successfully" });
    }
  );
});

// Delete a specific transactionitem by ID
router.delete("/transaction-items/:id", (req, res) => {
  const transactionItemID = req.params.id;

  con.query(
    "DELETE FROM transactionitem WHERE ID = ?",
    [transactionItemID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error deleting TransactionItem" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "TransactionItem not found" });
      }

      return res
        .status(204)
        .json({ message: "TransactionItem deleted successfully" });
    }
  );
});

module.exports = router;
