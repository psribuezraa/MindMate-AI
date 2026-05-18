require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
  const uri = "mongodb://psribuezraa_db_user:gz0w4xR2ftb3Hpib@ac-ejh5lcn-shard-00-00.ieprri8.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=MindMate-AI";
  
  console.log("Testing single node connection with family 4...");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000, family: 4 });
    console.log("SUCCESS!");
    await mongoose.disconnect();
  } catch (e) {
    console.error("FAIL", e.message);
  }
}
test();
