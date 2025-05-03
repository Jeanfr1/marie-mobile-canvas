const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const { v4: uuidv4 } = require("uuid");

exports.handler = async (event) => {
  try {
    const { httpMethod, body } = event;
    const userId = event.requestContext.authorizer?.claims?.sub;

    switch (httpMethod) {
      case "POST":
        return await getUploadUrl(userId, JSON.parse(body));
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

async function getUploadUrl(userId, { contentType }) {
  const imageId = uuidv4();
  const key = `${userId}/${imageId}`;

  const params = {
    Bucket: "gift-tracker-images-147997144209",
    Key: key,
    ContentType: contentType,
    Expires: 300, // URL expires in 5 minutes
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
  const imageUrl = `https://gift-tracker-images-147997144209.s3.amazonaws.com/${key}`;

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl,
      imageUrl,
      imageId,
    }),
  };
}
