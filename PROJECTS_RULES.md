Gift Tracker App - Project Rules
📱 Project Awareness & Context

Always read PLANNING.md at the start of a new conversation to understand the backend architecture, AWS services, and integration goals.
Check TASKS.md before starting a new task. If the task isn't listed, add it with a brief description and today's date.
Use consistent naming conventions across AWS resources and backend code.
Remember that the frontend is already complete - focus only on backend development and integration.

🏗️ AWS Architecture & Best Practices

Follow AWS Well-Architected Framework for serverless applications.
Use infrastructure as code when possible (AWS CDK, CloudFormation, or Terraform).
Keep Lambda functions focused on single responsibilities.
Properly manage environment variables and secrets using AWS Parameter Store or Secrets Manager.
Design DynamoDB tables carefully to minimize costs and maximize query efficiency.

📊 Database Design

Follow DynamoDB best practices:

Design tables with access patterns in mind
Use composite keys effectively
Consider single-table design where appropriate
Avoid scans in favor of queries

Document all indexes and key structures in comments or documentation.
Keep DynamoDB operations efficient by retrieving only needed attributes.

🧱 Code Structure & Modularity

Organize Lambda functions logically by resource or domain.
Share common code through Lambda layers or utility modules.
Never exceed 10MB in Lambda deployment packages.
Structure each Lambda function consistently:
javascript// Imports
// Configuration
// Helper functions
// Main handler function
// Exports

🔒 Security Best Practices

Follow the principle of least privilege for all IAM roles.
Never hardcode credentials in any code.
Use Cognito user pools correctly for authentication and authorization.
Implement proper validation on all API inputs.
Set appropriate CORS policies for API Gateway.
Configure S3 bucket policies correctly to prevent public access where not needed.

📷 Image & Media Handling

Use pre-signed URLs for direct S3 uploads from the frontend.
Implement size limits for uploaded images.
Consider setting up a CloudFront distribution for efficient image delivery.
Use appropriate S3 storage classes based on access patterns.

🧪 Testing & Reliability

Write unit tests for Lambda functions using Jest or Mocha.
Test with actual AWS services when needed (or use localstack for local development).
Create test events for each Lambda function.
Implement proper error handling and logging in all Lambda functions.
Set up CloudWatch alarms for critical resources.

🧮 Cost Management

Monitor AWS costs regularly with AWS Cost Explorer.
Set up budget alerts to prevent unexpected charges.
Use on-demand capacity mode for DynamoDB during development.
Implement appropriate TTL for temporary data.
Choose appropriate Lambda memory settings based on function needs.

✅ Task Completion

Mark completed tasks in TASKS.md immediately after finishing them.
Document any AWS resource created (with ARNs or names when relevant).
Add new sub-tasks discovered during development to TASKS.md.
Test each component before marking a task complete.

📏 Code Style & Conventions

Use JavaScript or TypeScript for Lambda functions.
Follow standard JS/TS style conventions.
Use async/await instead of callbacks or promises chains.
Implement proper error handling with try/catch blocks.
Use consistent naming conventions:
// Functions: camelCase
// Constants: UPPER_SNAKE_CASE
// Files: kebab-case
// Lambda functions: gift-tracker-{purpose}
// DynamoDB tables: GiftTracker-{resource}

📚 Documentation & Maintainability

Document each API endpoint with:

Purpose
Request format
Response format
Required permissions
Example usage

Comment complex business logic in Lambda functions.
Create diagrams for complex workflows.
Keep a list of all AWS resources created for the project.
Document DynamoDB access patterns and table design decisions.

🚀 API Design

Create RESTful API endpoints following standard conventions:

GET for retrieval
POST for creation
PUT for complete updates
PATCH for partial updates
DELETE for removal

Use consistent response formats:
json{
"success": true/false,
"data": {...},
"error": "Error message if applicable"
}

Implement proper status codes (200, 201, 400, 401, 403, 404, 500).
Add appropriate input validation at the API Gateway level.

🔄 Integration with Frontend

Maintain compatibility with existing frontend data structures.
Document any API changes that require frontend updates.
Test all integrations with the actual frontend code.
Use AWS Amplify to simplify frontend-backend integration.

📦 Deployment & Environment

Create separate environments (dev, prod) where feasible.
Use descriptive naming for all AWS resources with appropriate prefixes.
Document deployment steps for future reference.
Implement proper logging for troubleshooting.
Consider automated deployment with GitHub Actions or AWS CodePipeline.

💻 Development Behavior Rules

Never assume missing context. Ask questions if requirements are unclear.
Test locally before deploying to AWS when possible.
Always look for the simplest solution that meets requirements.
Consider cost implications of all architectural decisions.
Prioritize maintainability and simplicity over complex optimizations for this personal project.
