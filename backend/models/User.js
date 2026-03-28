const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    income: Number,
    expenses: Number,
    savings: Number,
    jobStability: String,
    dependents: Number,
    existingEMI: Number,
    healthInsurance: String,
    investments: Number,
    risk: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
