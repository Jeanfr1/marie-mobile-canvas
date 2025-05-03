const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { httpMethod, path, body } = event;
    const userId = event.requestContext.authorizer?.claims?.sub;

    switch (httpMethod) {
      case "GET":
        if (path.includes("/gifts/")) {
          const giftId = path.split("/").pop();
          return await getGift(userId, giftId);
        }
        return await listGifts(userId);
      case "POST":
        return await createGift(userId, JSON.parse(body));
      case "PUT":
        const giftId = path.split("/").pop();
        return await updateGift(userId, giftId, JSON.parse(body));
      case "DELETE":
        const deleteGiftId = path.split("/").pop();
        return await deleteGift(userId, deleteGiftId);
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

async function listGifts(userId) {
  const params = {
    TableName: "GiftTracker-Gifts",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const result = await dynamodb.query(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}

async function getGift(userId, giftId) {
  const params = {
    TableName: "GiftTracker-Gifts",
    Key: { userId, giftId },
  };

  const result = await dynamodb.get(params).promise();

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Gift not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
}

async function createGift(userId, giftData) {
  const giftId = uuidv4();
  const gift = {
    userId,
    giftId,
    createdAt: new Date().toISOString(),
    ...giftData,
  };

  await dynamodb
    .put({
      TableName: "GiftTracker-Gifts",
      Item: gift,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(gift),
  };
}

async function updateGift(userId, giftId, giftData) {
  const params = {
    TableName: "GiftTracker-Gifts",
    Key: { userId, giftId },
    UpdateExpression:
      "set #title = :title, description = :description, occasion = :occasion, imageUrl = :imageUrl, updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#title": "title",
    },
    ExpressionAttributeValues: {
      ":title": giftData.title,
      ":description": giftData.description,
      ":occasion": giftData.occasion,
      ":imageUrl": giftData.imageUrl,
      ":updatedAt": new Date().toISOString(),
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamodb.update(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes),
  };
}

async function deleteGift(userId, giftId) {
  await dynamodb
    .delete({
      TableName: "GiftTracker-Gifts",
      Key: { userId, giftId },
    })
    .promise();

  return {
    statusCode: 204,
    body: "",
  };
}
