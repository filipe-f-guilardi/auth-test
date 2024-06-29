require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./routes/index")(app);

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running in port 3000!!")
);
