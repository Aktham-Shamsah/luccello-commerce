import { Stack, type StackProps } from "aws-cdk-lib";
import { CfnWebACL } from "aws-cdk-lib/aws-wafv2";
import type { Construct } from "constructs";
import type { EnvironmentConfig } from "../config/environments.js";

export class SecurityStack extends Stack {
  readonly webAcl: CfnWebACL;

  constructor(scope: Construct, id: string, props: StackProps & { config: EnvironmentConfig }) {
    super(scope, id, props);
    this.webAcl = new CfnWebACL(this, "WebAcl", {
      defaultAction: { allow: {} },
      scope: "REGIONAL",
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: `${props.config.envName}-web-acl`,
        sampledRequestsEnabled: true,
      },
      rules: [
        {
          name: "RateLimit",
          priority: 1,
          action: { block: {} },
          statement: {
            rateBasedStatement: { aggregateKeyType: "IP", limit: props.config.wafRateLimit },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: `${props.config.envName}-rate-limit`,
            sampledRequestsEnabled: true,
          },
        },
      ],
    });
  }
}
