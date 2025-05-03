import { Amplify } from "aws-amplify";
import { awsConfig } from "../config/aws-config";

Amplify.configure({
  Auth: {
    region: awsConfig.region,
    userPoolId: awsConfig.userPoolId,
    userPoolWebClientId: awsConfig.userPoolWebClientId,
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
            return {};
          }
        },
      },
    ],
  },
});
