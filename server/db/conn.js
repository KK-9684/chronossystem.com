const mongoose = require("mongoose");

const  db_connection = async () => {
  try {
    await mongoose.connect(process.env.DB_PATH);
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

module.exports = db_connection;
