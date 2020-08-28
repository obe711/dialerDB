const router = require("express").Router();
const { Tour } = require("../models/Tour");
const { Sms } = require("../models/Sms");
const { apiErrorHandler } = require("../services");
const twilio = require("twilio");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const shouldValidate = process.env.NODE_ENV !== "development";

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
  twilio.webhook({ validate: shouldValidate }),
  async (req, res) => {
    try {
      const { To, From, Body } = req.body;
      const foundMatchingTour = await Tour.findOne({ phone: From }).exec();
      const newMessage = await new Sms({ To, From, Body }, { strict: false });
      if (foundMatchingTour) {
        foundMatchingTour.sms = [newMessage._id, ...foundMatchingTour.sms];
        newMessage.tour = foundMatchingTour._id;
        await foundMatchingTour.save();
      }
      await newMessage.save();

      const response = new MessagingResponse();
      response.message(`Please call me if you need anything`);
      res.set("Content-Type", "text/xml");
      res.send(response.toString());
    } catch (err) {
      apiErrorHandler(res, err);
    }
  }
);

module.exports = router;
