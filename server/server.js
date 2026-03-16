require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

global.__basedir = __dirname;

const app = express();

var corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:4200",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Limit each IP to 30 requests per minute on the API
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
});
app.use("/api/", apiLimiter);

const db = require("./app/models");
db.sequelize.sync({});

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

require("./app/routes/account.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
