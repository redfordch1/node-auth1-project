const server = require("./api/server.js");

const PORT = process.env.PORT || 4444;
server.listen(PORT, () =>
  console.log(` Server is running on port ==> ${PORT}!!`),
);
