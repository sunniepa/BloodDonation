const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const _CONST = require("./app/config/constant");
const hospitalRouter = require("./app/routers/hospital");
const medicalStaffRouter = require("./app/routers/medicalStaff");
const userV2Router = require("./app/routers/userV2");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

require("./app/models/createTables");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "BloodDonation",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL.");
  }
});

const authRoute = require("./app/routers/auth");
const userRoute = require("./app/routers/user");
const eventRoute = require("./app/routers/event");
const donationHistoryRoute = require("./app/routers/donationHistory");
const donorProfileRoute = require("./app/routers/donorProfile");
const bloodStorageRoute = require("./app/routers/bloodStorage");
const bloodRequestRoute = require("./app/routers/bloodRequest");
const reportsRoute = require("./app/routers/reports");
const donationCertificateRoute = require("./app/routers/donationCertificate");
const giftHistoryRoute = require("./app/routers/giftHistory");
const eventCategoryRoute = require("./app/routers/eventCategory");
const eventRegistrationRouter = require("./app/routers/eventRegistration");

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);
app.use("/api/registrations", eventRegistrationRouter);
app.use("/api/donations", donationHistoryRoute);
app.use("/api/donors", donorProfileRoute);
app.use("/api/blood-storage", bloodStorageRoute);
app.use("/api/blood-requests", bloodRequestRoute);
app.use("/api/reports", reportsRoute);
app.use("/api/donation-certificates", donationCertificateRoute);
app.use("/api/gift-histories", giftHistoryRoute);
app.use("/api/event-categories", eventCategoryRoute);
app.use("/api/hospitals", hospitalRouter);
app.use("/api/medical-staff", medicalStaffRouter);
app.use("/api/users-v2", userV2Router);

const PORT = process.env.PORT || _CONST.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
