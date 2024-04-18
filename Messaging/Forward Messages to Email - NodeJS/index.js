require("dotenv").config();
let { Messaging } = require("@signalwire/realtime-api");
let formData = require("form-data");
let mailgun = require("mailgun.js");

const swClient = new Messaging.Client({
  project: process.env.PROJECT_ID,
  token: process.env.API_TOKEN,
  contexts: ["office"],
});

const Mailgun = new mailgun(formData);
const mgClient = Mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_TOKEN,
});

swClient.on("message.received", (message) => {
  let date = new Date().toISOString();
  let body = message.body;
  let from = message.from;
  let to = message.to;
  let media = message.media;
  let data = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "Incoming Message to " + to,
    text: `At ${date} you received a message from ${from} to ${to}. The message body was: '${body}'. The included media was: ${media}`,
  };

  mgClient.messages
    .create(process.env.MAILGUN_DOMAIN, data)
    .then((res) => {
      console.log(data);
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
});
