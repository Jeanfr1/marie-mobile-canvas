const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { httpMethod, path, body } = event;
    const userId = event.requestContext.authorizer?.claims?.sub;

    switch (httpMethod) {
      case "GET":
        if (path.includes("/contacts/")) {
          const contactId = path.split("/").pop();
          return await getContact(userId, contactId);
        }
        return await listContacts(userId);
      case "POST":
        return await createContact(userId, JSON.parse(body));
      case "PUT":
        const contactId = path.split("/").pop();
        return await updateContact(userId, contactId, JSON.parse(body));
      case "DELETE":
        const deleteContactId = path.split("/").pop();
        return await deleteContact(userId, deleteContactId);
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

async function listContacts(userId) {
  const params = {
    TableName: "GiftTracker-Contacts",
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

async function getContact(userId, contactId) {
  const params = {
    TableName: "GiftTracker-Contacts",
    Key: { userId, contactId },
  };

  const result = await dynamodb.get(params).promise();

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Contact not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
}

async function createContact(userId, contactData) {
  const contactId = uuidv4();
  const contact = {
    userId,
    contactId,
    createdAt: new Date().toISOString(),
    ...contactData,
  };

  await dynamodb
    .put({
      TableName: "GiftTracker-Contacts",
      Item: contact,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(contact),
  };
}

async function updateContact(userId, contactId, contactData) {
  const params = {
    TableName: "GiftTracker-Contacts",
    Key: { userId, contactId },
    UpdateExpression:
      "set #name = :name, email = :email, phone = :phone, relationship = :relationship, updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":name": contactData.name,
      ":email": contactData.email,
      ":phone": contactData.phone,
      ":relationship": contactData.relationship,
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

async function deleteContact(userId, contactId) {
  await dynamodb
    .delete({
      TableName: "GiftTracker-Contacts",
      Key: { userId, contactId },
    })
    .promise();

  return {
    statusCode: 204,
    body: "",
  };
}
