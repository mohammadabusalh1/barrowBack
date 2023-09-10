const express = require("express");
const con = require("./database/conection");
const Joi = require("joi");
const router = express.Router();

// Joi schema for validation
const transactionDetailsSchema = Joi.object({
  ID: Joi.number().integer().min(1).required(),
  TransactionItem: Joi.number().integer().min(1).required(),
  PatronDetailsID: Joi.string().required(),
  CheckOutDate: Joi.date().iso().required(),
  Notes: Joi.string(),
  Late: Joi.boolean().default(false),
});

// Create a new transaction detail
router.post("/", (req, res) => {
  const { error } = transactionDetailsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newTransactionDetail = req.body;

  con.query(
    "INSERT INTO TransactionDetails SET ?",
    newTransactionDetail,
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error creating TransactionDetail" });
      }

      return res
        .status(201)
        .json({ message: "TransactionDetail created successfully" });
    }
  );
});

// Read all transaction details
router.get("/", (req, res) => {
  con.query("SELECT * FROM TransactionDetails", (err, rows) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Error fetching TransactionDetails" });
    }

    return res.status(200).json(rows);
  });
});

// Read a specific transaction detail by TransID
router.get("/:TransID", (req, res) => {
  const transactionID = req.params.TransID;

  con.query(
    "SELECT * FROM TransactionDetails WHERE ID = ?",
    [transactionID],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error fetching TransactionDetail" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "TransactionDetail not found" });
      }

      return res.status(200).json(rows[0]);
    }
  );
});

// Update a specific transaction detail by TransID
router.put("/:TransID", (req, res) => {
  const transactionID = req.params.TransID;
  const { error } = transactionDetailsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const updatedTransactionDetail = req.body;

  con.query(
    "UPDATE TransactionDetails SET ? WHERE ID = ?",
    [updatedTransactionDetail, transactionID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error updating TransactionDetail" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "TransactionDetail not found" });
      }

      return res
        .status(200)
        .json({ message: "TransactionDetail updated successfully" });
    }
  );
});

// Delete a specific transaction detail by TransID
router.delete("/:TransID", (req, res) => {
  const transactionID = req.params.TransID;

  con.query(
    "DELETE FROM TransactionDetails WHERE ID = ?",
    [transactionID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error deleting TransactionDetail" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "TransactionDetail not found" });
      }

      return res
        .status(204)
        .json({ message: "TransactionDetail deleted successfully" });
    }
  );
});

module.exports = router;
