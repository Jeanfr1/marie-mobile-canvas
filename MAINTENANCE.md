# Gift Tracker Maintenance Guide

## Overview

This guide provides instructions for maintaining and troubleshooting the Gift Tracker application's AWS infrastructure and services.

## AWS Services Overview

### Account Information

- Region: `us-east-1` (N. Virginia)
- Account ID: `147997144209`

### Critical Resources

1. **API Gateway**

   - Name: `gift-tracker-api`
   - Endpoint: `https://buaes967sk.execute-api.us-east-1.amazonaws.com/prod`
   - Stage: `prod`

2. **Cognito User Pool**

   - ID: `us-east-1_b9yk9AeaO`
   - Client ID: `7er1ri5q5vkqkrecg0dkvbt724`

3. **S3 Bucket**

   - Name: `gift-tracker-images-147997144209`
   - Lifecycle Rules:
     - Move to STANDARD_IA after 30 days
     - Delete after 365 days

4. **DynamoDB Tables**

   - `GiftTracker-Users`
   - `GiftTracker-Gifts`
   - `GiftTracker-Contacts`
   - `GiftTracker-Events`

5. **Lambda Functions**
   - `gift-tracker-users`
   - `gift-tracker-gifts`
   - `gift-tracker-contacts`
   - `gift-tracker-events`
   - `gift-tracker-images`

## Routine Maintenance Tasks

### Daily Monitoring

1. Check CloudWatch Logs for Lambda errors

   ```bash
   aws logs filter-log-events --log-group-name "/aws/lambda/gift-tracker-users" --filter-pattern "ERROR"
   ```

2. Monitor API Gateway requests

   - Check for 4xx and 5xx errors in CloudWatch
   - Review throttling metrics

3. Review Cognito sign-ins
   - Check for unusual patterns
   - Monitor failed authentication attempts

### Weekly Tasks

1. Review DynamoDB metrics

   - Check consumed capacity
   - Monitor throttled requests
   - Verify index usage

2. Check S3 storage metrics

   - Monitor storage growth
   - Verify lifecycle transitions
   - Review access patterns

3. Audit Lambda function performance
   - Review execution times
   - Check memory usage
   - Monitor error rates

### Monthly Tasks

1. Cost Review

   - Check AWS Cost Explorer
   - Review service usage
   - Identify optimization opportunities

2. Security Check

   - Review IAM roles and policies
   - Check for unused credentials
   - Verify CORS settings

3. Backup Verification
   - Verify DynamoDB backups
   - Test restore procedures
   - Review backup retention

## Troubleshooting Guide

### API Issues

#### 401 Unauthorized Errors

1. Verify Cognito token validity
2. Check Cognito User Pool configuration
3. Verify API Gateway authorizer settings

#### 403 Forbidden Errors

1. Check IAM roles and policies
2. Verify Lambda execution permissions
3. Review resource-based policies

#### 500 Internal Server Errors

1. Check Lambda function logs
2. Verify DynamoDB access
3. Review function timeouts

### Image Upload Issues

1. Verify S3 bucket permissions
2. Check CORS configuration
3. Validate pre-signed URL generation

### Authentication Issues

1. Verify Cognito User Pool settings
2. Check client app configuration
3. Review authentication flow settings

## Deployment Procedures

### Lambda Function Updates

1. Update code locally
2. Create deployment package:
   ```bash
   cd lambda-functions/<function-name>
   zip -r ../function.zip .
   ```
3. Deploy update:
   ```bash
   aws lambda update-function-code --function-name gift-tracker-<name> --zip-file fileb://../function.zip
   ```

### API Gateway Changes

1. Make changes in API Gateway console
2. Deploy to prod stage:
   ```bash
   aws apigateway create-deployment --rest-api-id buaes967sk --stage-name prod
   ```

### DynamoDB Updates

1. Backup table before changes:
   ```bash
   aws dynamodb create-backup --table-name GiftTracker-<table> --backup-name backup-$(date +%Y%m%d)
   ```
2. Apply changes
3. Verify data integrity

## Scaling Considerations

### DynamoDB

- Currently using on-demand capacity
- Monitor for hot partitions
- Consider adding GSIs for new access patterns

### Lambda Functions

- Monitor memory usage and duration
- Adjust timeout settings if needed
- Consider concurrent execution limits

### S3 Storage

- Monitor storage growth
- Review lifecycle rules effectiveness
- Consider implementing request rate monitoring

## Security Best Practices

### Access Management

- Use least privilege principle
- Regularly rotate credentials
- Monitor AWS CloudTrail logs

### Data Protection

- All data encrypted at rest
- Secure transmission using HTTPS
- Regular security audits

### Compliance

- Regular permission reviews
- Monitor for regulatory requirements
- Document all security changes

## Backup and Recovery

### DynamoDB Backups

- Point-in-time recovery enabled
- Daily backups retained for 35 days
- Monthly backups stored for 1 year

### Recovery Procedures

1. Identify backup point
2. Create restore plan
3. Test in staging environment
4. Execute recovery
5. Verify data integrity

## Monitoring and Alerts

### CloudWatch Alarms

- Lambda error rate > 1%
- API Gateway 5xx rate > 1%
- DynamoDB throttling > 0

### Performance Metrics

- API latency < 1000ms
- Lambda duration < 3000ms
- S3 upload success rate > 99%

## Contact Information

### Support Escalation

1. Development Team
2. AWS Support (if applicable)
3. Security Team (for security incidents)

### Important Links

- AWS Console: https://console.aws.amazon.com
- API Documentation: See API.md
- Architecture Overview: See ARCHITECTURE.md

## Disaster Recovery

### Scenario 1: Data Corruption

1. Stop API access
2. Identify corruption scope
3. Restore from backup
4. Verify data integrity
5. Resume API access

### Scenario 2: Service Outage

1. Check AWS service health
2. Review CloudWatch logs
3. Execute relevant recovery procedure
4. Update status page
5. Post-mortem analysis

## Cost Optimization

### Regular Reviews

- Monitor service usage
- Identify unused resources
- Review storage patterns

### Optimization Strategies

1. Lambda

   - Optimize memory allocation
   - Review timeout settings
   - Monitor cold starts

2. DynamoDB

   - Review capacity mode
   - Monitor GSI usage
   - Optimize queries

3. S3
   - Monitor storage classes
   - Review lifecycle rules
   - Analyze access patterns
