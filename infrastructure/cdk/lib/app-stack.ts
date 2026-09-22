import { Duration, Stack, type StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Bucket, BlockPublicAccess, BucketEncryption } from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";
import type { EnvironmentConfig } from "../config/environments.js";

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps & { config: EnvironmentConfig }) {
    super(scope, id, props);
    const bucket = new Bucket(this, "PrivateAssets", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      versioned: true,
    });
    const queue = new Queue(this, "BackgroundJobs", {
      visibilityTimeout: Duration.seconds(60),
      retentionPeriod: Duration.days(4),
    });
    const apiFunction = new NodejsFunction(this, "CatalogRead", {
      runtime: Runtime.NODEJS_22_X,
      entry: "../../services/api/src/server.ts",
      reservedConcurrentExecutions: 50,
      environment: {
        APP_ENV: props.config.envName,
        VERSION: "0.1.0-local-ready",
      },
    });
    bucket.grantReadWrite(apiFunction);
    queue.grantSendMessages(apiFunction);
    const api = new RestApi(this, "Api", {
      deployOptions: {
        throttlingBurstLimit: props.config.apiRateLimit,
        throttlingRateLimit: props.config.apiRateLimit,
        metricsEnabled: true,
      },
    });
    api.root.addProxy({ defaultIntegration: new LambdaIntegration(apiFunction) });
  }
}
