const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../users/users-model.js");

// for endpoints beginning with /api/auth
router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);
        res.status(200).json({ token, message: `Welcome ${user.username}!!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

function signToken(user) {
  const payload = {
    username: user.username,
    department: user.department,
  };
  const secret = process.env.JWT_SECRET || "This is the secret";
  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}
//!==================================================================================

// router.get("/logout", (req, res) => {
//   if (req.session) {
//     req.session.destroy((err) => {
//       if (err) {
//         res.status(500).json({
//           you: "can checkout any time you like, but you can never leave!",
//         });
//       } else {
//         res.status(200).json({ message: "You are now logged out!!" });
//       }
//     });
//   } else {
//     res.status(204);
//   }
// });

module.exports = router;
