const createError = require("http-errors");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

const auditComp = require("./routes/auditComp")
// const company = require("./routes/company")
app.use(cors());

app.use("/audit",auditComp)
// app.use("/company",company)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
