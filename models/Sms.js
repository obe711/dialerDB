const mongoose = require("mongoose");
const { ChatBot } = require("./ChatBot");

const smsSchema = new mongoose.Schema(
  {
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    ToCountry: String,
    ToState: String,
    SmsMessageSid: String,
    NumMedia: Number,
    ToCity: String,
    FromZip: String,
    SmsSid: String,
    FromState: String,
    SmsStatus: String,
    FromCity: String,
    Body: String,
    FromCountry: String,
    To: String,
    ToZip: String,
    NumSegments: Number,
    MessageSid: String,
    AccountSid: String,
    From: String,
  },
  { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);

const Sms = mongoose.model("Sms", smsSchema);

const smsNumbersSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true, required: true },
    history: [{ type: mongoose.ObjectId, ref: Sms }],
    chatbot: [{ type: mongoose.ObjectId, ref: "ChatBot" }],
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);
const PhoneNumber = mongoose.model("PhoneNumber", smsNumbersSchema);

exports.Sms = Sms;
exports.PhoneNumber = PhoneNumber;
