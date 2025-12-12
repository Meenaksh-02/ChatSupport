const mongoose = require("mongoose");
const Admin = require("./src/models/Admin");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB");

    // DELETE OLD ADMINS
    await Admin.deleteMany({});
    console.log("Old admins removed");

    // CREATE NEW ADMIN
    await Admin.create({
      email: "admin@gmail.com",
      password: "Admin@123", // <-- password you will use at login
    });

    console.log("New admin created!");
    process.exit();
  })
  .catch((err) => {
    console.error("DB Error:", err);
  });


  username 
  paassword