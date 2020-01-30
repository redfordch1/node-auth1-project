const router = require("express").Router();
const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");

router.get("/", restricted, (req, res) => {
  const { department } = req.token;
  if (req.token.department === "Admin") {
    Users.find().then((users) => {
      console.log("User 1 ==> ", users);
      res.json(users);
    });
  } else {
    Users.findBy({ department })
      .then((users) => {
        console.log("User 2 ==> ", users);
        res.json(users);
      })
      .catch((err) => res.send(err));
  }
});

module.exports = router;
