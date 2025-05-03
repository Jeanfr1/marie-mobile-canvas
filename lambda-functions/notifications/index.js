const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { httpMethod } = event;
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (httpMethod === "GET") {
      return await listNotifications(userId);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Unsupported method" }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

async function listNotifications(userId) {
  const params = {
    TableName: process.env.NOTIFICATIONS_TABLE || "GiftTracker-Notifications",
    IndexName: undefined, // Add GSI if needed for userId
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const result = await dynamodb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}
