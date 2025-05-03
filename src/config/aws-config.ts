export const awsConfig = {
  region: "us-east-1",
  // Cognito
  userPoolId: "us-east-1_b9yk9AeaO",
  userPoolWebClientId: "7er1ri5q5vkqkrecg0dkvbt724",

  // S3
  bucketName: "gift-tracker-images-147997144209",

  // API Gateway
  apiEndpoint: "https://buaes967sk.execute-api.us-east-1.amazonaws.com/prod",
};

// Alternative configuration for production environment
export const productionAwsConfig = {
  region: "us-east-1",
  // Cognito - These are the exact same values as above, but explicitly specified for production
  userPoolId: "us-east-1_b9yk9AeaO",
  userPoolWebClientId: "7er1ri5q5vkqkrecg0dkvbt724",

  // S3
  bucketName: "gift-tracker-images-147997144209",

  // API Gateway
  apiEndpoint: "https://buaes967sk.execute-api.us-east-1.amazonaws.com/prod",
};

// We'll update this file with actual values as we create each service
