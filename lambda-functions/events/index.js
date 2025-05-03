const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { httpMethod, path, body } = event;
    const userId = event.requestContext.authorizer?.claims?.sub;

    switch (httpMethod) {
      case "GET":
        if (path.includes("/events/")) {
          const eventId = path.split("/").pop();
          return await getEvent(userId, eventId);
        }
        return await listEvents(userId);
      case "POST":
        return await createEvent(userId, JSON.parse(body));
      case "PUT":
        const eventId = path.split("/").pop();
        return await updateEvent(userId, eventId, JSON.parse(body));
      case "DELETE":
        const deleteEventId = path.split("/").pop();
        return await deleteEvent(userId, deleteEventId);
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

async function listEvents(userId) {
  const params = {
    TableName: "GiftTracker-Events",
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

async function getEvent(userId, eventId) {
  const params = {
    TableName: "GiftTracker-Events",
    Key: { userId, eventId },
  };

  const result = await dynamodb.get(params).promise();

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Event not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
}

async function createEvent(userId, eventData) {
  const eventId = uuidv4();
  const event = {
    userId,
    eventId,
    createdAt: new Date().toISOString(),
    ...eventData,
  };

  await dynamodb
    .put({
      TableName: "GiftTracker-Events",
      Item: event,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(event),
  };
}

async function updateEvent(userId, eventId, eventData) {
  const params = {
    TableName: "GiftTracker-Events",
    Key: { userId, eventId },
    UpdateExpression:
      "set #name = :name, date = :date, type = :type, description = :description, reminder = :reminder, updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":name": eventData.name,
      ":date": eventData.date,
      ":type": eventData.type,
      ":description": eventData.description,
      ":reminder": eventData.reminder,
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

async function deleteEvent(userId, eventId) {
  await dynamodb
    .delete({
      TableName: "GiftTracker-Events",
      Key: { userId, eventId },
    })
    .promise();

  return {
    statusCode: 204,
    body: "",
  };
}
