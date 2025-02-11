const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require ("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: [
        ],
        ToAddresses: [
          toAddress,
        ],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: "<h1>This is a test email from codeToElevate</h1>",
          },
          Text: {
            Charset: "UTF-8",
            Data: "This is the text format email",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "CODETOELEVATE",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };

  const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
      "rahbit25@gmail.com",
      "rahuljha@codetoelevate.in",
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  // snippet-end:[ses.JavaScript.email.sendEmailV3]
  module.exports = { run };