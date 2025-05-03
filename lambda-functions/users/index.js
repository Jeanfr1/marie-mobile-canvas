const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { httpMethod, path, body } = event;
    const userId = event.requestContext.authorizer?.claims?.sub;

    switch (httpMethod) {
      case "GET":
        return await getUser(userId);
      case "PUT":
        return await updateUser(userId, JSON.parse(body));
      default:
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

async function getUser(userId) {
  const params = {
    TableName: "GiftTracker-Users",
    Key: { userId },
  };

  const result = await dynamodb.get(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item || {}),
  };
}

async function updateUser(userId, userData) {
  const params = {
    TableName: "GiftTracker-Users",
    Key: { userId },
    UpdateExpression:
      "set #name = :name, #email = :email, #preferences = :preferences",
    ExpressionAttributeNames: {
      "#name": "name",
      "#email": "email",
      "#preferences": "preferences",
    },
    ExpressionAttributeValues: {
      ":name": userData.name,
      ":email": userData.email,
      ":preferences": userData.preferences || {},
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamodb.update(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes),
  };
}
