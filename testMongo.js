// testMongo.js
const mongoose = require('mongoose');

const uri = "mongodb+srv://travelUser:ArB3Rd7Hza3f77Rd@cluster0.xk2hzsn.mongodb.net/TravelPlanner";

mongoose.connect(uri)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });
