require("dotenv").config();
const router = require("express").Router();
const { Sms, PhoneNumber } = require("../models/Sms");
const { ChatBot } = require("../models/ChatBot");
const { apiErrorHandler } = require("../services");
const twilio = require("twilio");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const shouldValidate = process.env.NODE_ENV !== "development";
const dialogflow = require("@google-cloud/dialogflow");

const sessionClient = new dialogflow.SessionsClient();

function sendToBot(id, query) {
  return sessionClient.detectIntent({
    session: sessionClient.projectAgentSessionPath("faq-hecb", id),
    queryInput: {
      text: {
        text: query,
        languageCode: "en-US",
      },
    },
  });
}

// Send Message
router.post("/out", async (req, res) => {
  try {
    const { from, body, to } = req.body;
    res.json(await client.messages.create({ from, body, to }));
  } catch (err) {
    apiErrorHandler(res, err);
  }
});

// Receive Message
router.post(
  "/in",
  twilio.webhook({ validate: true }),
  saveMessageData,
  chatbotReply,
  sendResponseSms
);

async function saveMessageData(req, res, next) {
  const newMessage = await new Sms(req.body);
  const foundPhoneNumber = await PhoneNumber.findOne({ phone: req.body.From });
  if (foundPhoneNumber) {
    foundPhoneNumber.history.push(newMessage._id);
    req.body.sessionId = foundPhoneNumber._id;
    await foundPhoneNumber.save();
  } else {
    const newPhone = await new PhoneNumber({
      phone: req.body.From,
      history: [newMessage._id],
    }).save();
    req.body.sessionId = newPhone._id;
  }
  await newMessage.save();
  return next();
}

function sendResponseSms(req, res, next) {
  try {
    const { sms } = req.body;
    const response = new MessagingResponse();
    response.message(sms);
    res.set("Content-Type", "text/xml");
    return res.send(response.toString());
  } catch (ex) {
    apiErrorHandler(res, err);
  }
}

async function chatbotReply(req, res, next) {
  try {
    const [responses] = await sendToBot(req.body.sessionId, req.body.Body);
    const { fulfillmentText, queryText, intent } = responses.queryResult;

    const chatbot = new ChatBot({
      sessionId: req.body.sessionId,
      fulfillmentText,
      queryText,
      intent: intent.displayName,
    });

    const sessionPhone = await PhoneNumber.findById(req.body.sessionId);
    sessionPhone.chatbot.push(chatbot._id);

    chatbot.save();
    sessionPhone.save();
    req.body.sms = fulfillmentText;
    next();
  } catch (ex) {
    apiErrorHandler(res, ex);
  }
}
module.exports = router;
