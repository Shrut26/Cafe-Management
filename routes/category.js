const express = require("express");
const connection = require("../connection");
const router = express.Router();

var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.post("/add", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  let category = req.body;
  var query = "insert into category(name) values (?)";
  connection.query(query, [category.name], (err, results) => {
    if (!err) {
      res.status(200).json({ message: "Category Added successfully" });
    } else {
      res.status(500).json({ message: err });
    }
  });
});

router.get("/get", auth.authenticateToken, (req, res) => {
  var query = "select * from category order by name";
  connection.query(query, (err, results) => {
    if (!err) {
      res.status(200).json(results);
    } else {
      res.status(500).json({ message: err });
    }
  });
});

router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    let product = req.body;
    var query = "update category set name = ? where id = ?";
    connection.query(query, [product.name, product.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Category Id doesn't exist" });
        } else {
          return res
            .status(200)
            .json({ message: "Category updated successfully" });
        }
      } else {
        return res.status(500).json({ message: err });
      }
    });
  }
);

router.delete(
  "/delete",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    let category = req.body;
    var query = "delete from category where id = ?";
    connection.query(query, [category.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res
            .status(404)
            .json({ message: "Category ID does not exists" });
        } else {
          return res
            .status(200)
            .json({ message: "Category deleted Successfully" });
        }
      } else {
        return res.status(500).json({ message: err });
      }
    });
  }
);

module.exports = router;
