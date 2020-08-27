const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
    time: { type: String, default: "MISSING" },
    phone: { type: String, default: "MISSING" },
    guest: { type: String, default: "MISSING" },
    confirmed: { type: Boolean, default: false },
    status: { type: String, default: "PENDING" },
    agent: { type: Number, default: 0000 },
  },
  { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);

exports.Tour = mongoose.model("Tours", tourSchema);
