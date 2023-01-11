const express = require("express");
const connection = require("../connection");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.post("/signup", (req, res) => {
  let user = req.body;
  query = "select email, password, role, status from user where email = ?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "insert into user(name, contactNumber, email, password, status, role) values(?, ?, ?, ?, 'false', 'user')";
        connection.query(
          query,
          [user.name, user.contactNumber, user.email, user.password],
          (err, results) => {
            if (!err) {
              return res
                .status(200)
                .json({ message: "Successfully registered" });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res.status(400).json({ message: "Email Already exists" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post("/login", (req, res) => {
  const user = req.body;
  query = "select email, password, role, status from user where email = ?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res.status(400).json({ message: "Incorrect crediatilas" });
      } else if (results[0].status == "false") {
        return res.status(401).json({ message: "Wait for admin approval" });
      } else if (results[0].password == user.password) {
        const response = { email: results[0].email, role: results[0].role };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "30hr",
        });

        res
          .status(200)
          .json({ token: accessToken, message: "Successfully logged in" });
      } else {
        return res.status(400).json({ message: "Something went wrong" });
      }
    } else {
      res.status(500).json(err);
    }
  });
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post("/forgotpassword", (req, res) => {
  const user = req.body;
  query = "select email, password from user where email = ?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(500).json({ message: "User not registered" });
      } else {
        var mailOptions = {
          from: process.env.EMAIL,
          password: process.env.PASSWORD,
          to: results[0].email,
          subject: "Password Change Request",
          html:
            "<p><b>Your login details will be : </b> <br> <b>Email : </b>" +
            results[0].email +
            "<br> <b>Password : </b>" +
            results[0].password +
            "<br><a href = 'http://localhost:4200'>Click here to Login again</a></p>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email Sent : " + info.response);
          }
        });
        return res.status(200).json({ message: "Password sent successfully" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/get", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  var query =
    "select id, name, email, contactNumber, status from user where role = 'user'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
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
    let user = req.body;
    var query = "update user set status = ? where id = ?";
    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(400).json({ message: "User id doesn't exists" });
        } else {
          return res.status(200).json({ message: "User updated successfully" });
        }
      } else {
        return res.status(500).json({ message: err });
      }
    });
  }
);

router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});

router.post("/changePassword", auth.authenticateToken, (req, res) => {
  const user = req.body;
  const email = res.locals.email;
  var query = "select * from user where email = ? and password = ?";
  connection.query(query, [email, user.oldPassword], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(400).json({ message: "Incorrect old password" });
      } else if (results[0].password == user.oldPassword) {
        query = "update user set password = ? where email = ?";
        connection.query(query, [user.newPassword, email], (err, results) => {
          if (!err) {
            return res
              .status(200)
              .json({ message: "Password changed Successfully" });
          } else {
            return res.status(500).json({ message: err });
          }
        });
      } else {
        return res.status(400).json({ message: "Something went wrong" });
      }
    } else {
      return res.status(500).json({ message: err });
    }
  });
});
module.exports = router;
