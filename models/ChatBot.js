const mongoose = require("mongoose");
const { PhoneNumber } = require("./Sms");

const chatbotSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.ObjectId, ref: "PhoneNumber" },
    queryText: { type: String },
    fulfillmentText: { type: String },
    intent: { type: String },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);

//chatbotSchema.path("sessionId").ref(PhoneNumber);

const ChatBot = mongoose.model("ChatBot", chatbotSchema);
exports.ChatBot = ChatBot;
