const express = require("express");
const router = express.Router();
const connection = require("../connection");
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.post("/add", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  let product = req.body;
  var query =
    "insert into product(name, categoryID,description,price, status) values(?,?,?,?,'true')";
  connection.query(
    query,
    [product.name, product.categoryID, product.description, product.price],
    (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Product Added successfully" });
      } else {
        return res.status(500).json({ message: err });
      }
    }
  );
});

router.get("/get", auth.authenticateToken, (req, res) => {
  var query =
    "select p.id, p.name, p.description, p.price, p.status, c.id as categoryID, c.name as categoryName from product as p INNER JOIN category as c where p.categoryID = c.id";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json({ message: err });
    }
  });
});

router.get("/getByCategory/:id", auth.authenticateToken, (req, res) => {
  const id = req.params.id;
  var query =
    "select id, name from product where categoryID = ? and status = 'true'";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json({ message: err });
    }
  });
});

router.get("/getbyID/:id", auth.authenticateToken, (req, res) => {
  const id = req.params.id;
  var query = "select id, name, description, price from product where id = ?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(500).json({ message: err });
    }
  });
});

router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    let product = req.body;
    var query =
      "update product set name = ?, categoryID = ?, description = ?, price = ? where id = ?";
    connection.query(
      query,
      [
        product.name,
        product.categoryID,
        product.description,
        product.price,
        product.id,
      ],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res
              .status(404)
              .json({ message: "Product ID does not exists" });
          } else {
            return res
              .status(200)
              .json({ message: "Product updated Successfully" });
          }
        } else {
          return res.status(500).json({ message: err });
        }
      }
    );
  }
);

router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    const id = req.params.id;
    var query = "delete from product where id = ?";
    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Product ID does not found" });
        } else {
          return res
            .status(200)
            .json({ message: "Product Deleted Successfully" });
        }
      } else {
        return res.status(500).json({ message: err });
      }
    });
  }
);

router.patch(
  "/updateStatus",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    let product = req.body;
    var query = "update product set status = ? where id = ?";
    connection.query(query, [product.status, product.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res
            .status(404)
            .json({ message: "Product ID does not exisits" });
        } else {
          return res
            .status(200)
            .json({ message: "Product's Status changed Successfully" });
        }
      } else {
        return res.status(500).json({ message: err });
      }
    });
  }
);
module.exports = router;
