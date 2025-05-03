Gift Tracker App - Simplified Backend Planning
Project Overview
The Gift Tracker App is a responsive web application designed to help users track gifts they've received and given. The frontend has already been completed with React and Vite. This planning document focuses on building a simple, cost-effective backend on AWS to connect with the existing frontend.
Existing Frontend Features
The following features have been implemented in the frontend:

Photo capture of gifts
Gift tagging (sender/receiver)
Contact management system
Event and occasion tracking
Reminder interface
Gift history views
User authentication UI

Simplified Backend Approach
Core Backend Features
Authentication System

Simple user registration and login using Amazon Cognito
Basic session management

Gift Data Management

Gift information storage (details, occasions)
Simple image references
Basic search capability

Contact Management

Basic contact information storage
Gift history per contact

Image Storage

Direct upload to Amazon S3
Simple access control

Basic Notification System

Simple reminder storage and retrieval
Frontend-driven notification display

Technical Specifications
Simplified Backend Stack (AWS)

Serverless Functions: AWS Lambda
Database: Amazon DynamoDB (NoSQL)
Storage: Amazon S3 for gift images
Authentication: Amazon Cognito
API Layer: Amazon API Gateway
Development: AWS Amplify to simplify implementation

Data Models (Simplified)

Users: Basic profiles and preferences
Gifts: Core details, image references, basic metadata
Contacts: Basic information and relationship to user
Events: Simple date and event type storage

Security Considerations

AWS built-in security features
Basic input validation
HTTPS for all communication

Simple Integration Plan
API Integration

Create straightforward REST endpoints
Use AWS Amplify on the frontend to simplify connections
Focus on core data operations (CRUD)

Simplified Data Flow

Frontend sends/receives JSON data
Images uploaded directly to S3 from the app
Basic error handling

Image Workflow

Frontend handles image compression
Direct upload to S3 using pre-signed URLs
Store image URL reference in database

Development Phases
Phase 1: AWS Setup & Authentication

Set up AWS account and services
Configure Cognito for authentication
Connect authentication to existing frontend

Phase 2: Core Data & Storage

Set up DynamoDB tables
Create Lambda functions for CRUD operations
Configure S3 buckets for image storage
Build basic API endpoints

Phase 3: Integration & Testing

Connect frontend to new backend services
Test data flow and image uploads
Verify authentication flow

Phase 4: Simple Deployment

Deploy Lambda functions and API Gateway
Set up basic monitoring
Document the system

AWS Services Breakdown
Amazon Cognito

User pools for authentication
Simple login/signup flow
JWT token handling

Amazon DynamoDB

NoSQL database for flexibility
Simple key-value storage
Low maintenance and cost for small scale

Amazon S3

Store gift images
Configure CORS for direct frontend uploads
Set lifecycles for cost management

AWS Lambda

Serverless functions for API logic
Pay only for what you use
Easy to maintain and update

API Gateway

RESTful API endpoints
Connect to Lambda functions
Basic request validation

AWS Amplify (Development Tool)

Simplifies AWS service integration
Provides client-side libraries
Handles authentication flows

Cost Considerations

AWS free tier coverage for initial development
Pay-as-you-go model for low usage
Focus on serverless to minimize costs when inactive
Simple architecture reduces development and maintenance time

Documentation

Basic API endpoint documentation
Setup instructions for future reference
Connection details for frontend developers

Success Criteria

Working backend integration with existing frontend
Secure user authentication
Successful data storage and retrieval
Reliable image upload and display
