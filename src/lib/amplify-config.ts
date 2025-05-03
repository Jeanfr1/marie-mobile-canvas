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
    region: config.region,
    userPoolId: config.userPoolId,
    userPoolWebClientId: config.userPoolWebClientId,
    // Don't use OAuth for now as it complicates the flow
    // We'll stick with basic username/password auth
  },
  Storage: {
    AWSS3: {
      bucket: config.bucketName,
      region: config.region,
    },
  },
  API: {
    endpoints: [
      {
        name: "GiftTrackerAPI",
        endpoint: config.apiEndpoint,
        region: config.region,
        custom_header: async () => {
          try {
            const session = await Amplify.Auth.currentSession();
            return {
              Authorization: `Bearer ${session.getIdToken().getJwtToken()}`,
            };
          } catch (error) {
            console.log("Error generating auth header:", error);
            return {};
          }
        },
      },
    ],
  },
});

// Add debugging in production
if (isProduction) {
  console.log("Running in production environment with AWS config:", {
    region: config.region,
    userPoolId: config.userPoolId,
    userPoolWebClientId: config.userPoolWebClientId,
    apiEndpoint: config.apiEndpoint,
  });
  // Enable more verbose logging for auth issues
  Amplify.Logger.LOG_LEVEL = "DEBUG";
}
