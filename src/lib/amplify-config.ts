import { Amplify } from "aws-amplify";
import { awsConfig } from "../config/aws-config";

// Get the environment from the runtime
const isProduction = window.location.hostname === "mgiftlist.netlify.app";

// Configure Amplify based on environment
Amplify.configure({
  Auth: {
    region: awsConfig.region,
    userPoolId: awsConfig.userPoolId,
    userPoolWebClientId: awsConfig.userPoolWebClientId,
    // Force HTTPS for production
    oauth: isProduction
      ? {
          domain: "mgiftlist-auth.auth.us-east-1.amazoncognito.com",
          scope: ["email", "profile", "openid"],
          redirectSignIn: "https://mgiftlist.netlify.app/",
          redirectSignOut: "https://mgiftlist.netlify.app/",
          responseType: "code",
        }
      : undefined,
  },
  Storage: {
    AWSS3: {
      bucket: awsConfig.bucketName,
      region: awsConfig.region,
    },
  },
  API: {
    endpoints: [
      {
        name: "GiftTrackerAPI",
        endpoint: awsConfig.apiEndpoint,
        region: awsConfig.region,
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
  console.log("Running in production environment");
  // Enable more verbose logging for auth issues
  Amplify.Logger.LOG_LEVEL = "DEBUG";
}
