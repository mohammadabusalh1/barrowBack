const express = require("express");
const con = require("./database/conection");
const Joi = require("joi");

const router = express.Router();
router.use(express.json());

// Joi schema for DeviceT validation
const deviceTSchema = Joi.object({
  DeviceName: Joi.string().required(),
  TISID: Joi.string().required(),
  ID: Joi.number().integer(),
  CategoryID: Joi.number().integer().required(),
  Details: Joi.string(),
  Notes: Joi.string(),
  Status: Joi.string(),
});

// Create a new DeviceT record
router.post("/", (req, res) => {
  const { error } = deviceTSchema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).json({ error: error.details[0].message });
  }

  const newDeviceT = {
    DeviceName: req.body.DeviceName,
    TISID: req.body.TISID,
    CategoryID: parseInt(req.body.CategoryID),
    Details: req.body.Details,
    Notes: req.body.Notes,
    Status: req.body.Status,
  };

  const sql =
    "INSERT INTO devicet (DeviceName, TISID, CategoryID, Details, Notes, Status) VALUES (?, ?, ?, ?, ?, ?)";
  con.query(
    sql,
    [
      newDeviceT.DeviceName,
      newDeviceT.TISID,
      newDeviceT.CategoryID,
      newDeviceT.Details,
      newDeviceT.Notes,
      newDeviceT.Status,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.status(201).json(newDeviceT);
    }
  );
});

// Retrieve all DeviceT records
router.get("/", (req, res) => {
  const sql = "SELECT * FROM devicet";

  con.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json(results);
  });
});

// Retrieve a single DeviceT record by DeviceID
router.get("/:id", (req, res) => {
  const deviceId = req.params.id;
  const sql = "SELECT * FROM devicet WHERE ID = ?";

  con.query(sql, [deviceId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "DeviceT record not found" });
    }

    res.json(results[0]);
  });
});

// Update a DeviceT record by DeviceID
router.put("/:id", (req, res) => {
  const deviceId = req.params.id;
  const { error } = deviceTSchema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).json({ error: error.details[0].message });
  }

  const updatedDeviceT = {
    DeviceName: req.body.DeviceName,
    TISID: req.body.TISID,
    ID: deviceId,
    CategoryID: req.body.CategoryID,
    Details: req.body.Details,
    Notes: req.body.Notes,
    Status: req.body.Status,
  };

  const sql =
    "UPDATE devicet SET DeviceName = ?, TISID = ?, CategoryID = ?, Details = ?, Notes = ?, Status = ? WHERE ID = ?";

  con.query(
    sql,
    [
      updatedDeviceT.DeviceName,
      updatedDeviceT.TISID,
      updatedDeviceT.CategoryID,
      updatedDeviceT.Details,
      updatedDeviceT.Notes,
      updatedDeviceT.Status,
      deviceId,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "DeviceT record not found" });
      }

      res.json(updatedDeviceT);
    }
  );
});

// Delete a DeviceT record by DeviceID
router.delete("/:id", (req, res) => {
  const deviceId = req.params.id;
  const sql = "DELETE FROM devicet WHERE ID = ?";

  con.query(sql, [deviceId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "DeviceT record not found" });
    }

    res.json({ message: "DeviceT record deleted successfully" });
  });
});

module.exports = router;
