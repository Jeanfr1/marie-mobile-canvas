import { Amplify } from "aws-amplify";
import { awsConfig, productionAwsConfig } from "../config/aws-config";

// Get the environment from the runtime
const isProduction = window.location.hostname === "mgiftlist.netlify.app";

console.log("Current hostname:", window.location.hostname);
console.log("Is production environment:", isProduction);

// Choose the appropriate config based on environment
const config = isProduction ? productionAwsConfig : awsConfig;

// Configure Amplify based on environment
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.userPoolId,
      userPoolClientId: config.userPoolWebClientId,
      region: config.region,
      authenticationFlowType: "USER_PASSWORD_AUTH",
    },
  },
  API: {
    REST: {
      GiftTrackerAPI: {
        endpoint: config.apiEndpoint,
        region: config.region,
      },
    },
  },
  Storage: {
    S3: {
      bucket: config.bucketName,
      region: config.region,
    },
  },
});

// Add debugging in production
if (isProduction) {
  console.log("Running in production environment with AWS config:", {
    region: config.region,
    userPoolId: config.userPoolId,
    userPoolClientId: config.userPoolWebClientId,
    apiEndpoint: config.apiEndpoint,
  });
}
