const mongoose = require("mongoose");

const smsSchema = new mongoose.Schema(
  {
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    To: { type: String, default: "MISSING" },
    From: { type: String, default: "MISSING" },
    Body: { type: String, default: false },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tours" },
  },
  { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);

exports.Sms = mongoose.model("Sms", smsSchema);
