import { Duration, RemovalPolicy, Stack, type StackProps } from "aws-cdk-lib";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import {
  AuroraPostgresEngineVersion,
  ClusterInstance,
  Credentials,
  DatabaseCluster,
  DatabaseProxy,
  DatabaseSecret,
  DatabaseClusterEngine,
} from "aws-cdk-lib/aws-rds";
import type { Construct } from "constructs";
import type { EnvironmentConfig } from "../config/environments.js";

export class DatabaseStack extends Stack {
  readonly cluster: DatabaseCluster;
  readonly proxy: DatabaseProxy;

  constructor(
    scope: Construct,
    id: string,
    props: StackProps & { vpc: Vpc; config: EnvironmentConfig },
  ) {
    super(scope, id, props);
    const secret = new DatabaseSecret(this, "DatabaseSecret", { username: "postgres" });
    this.cluster = new DatabaseCluster(this, "AuroraCluster", {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_16_4,
      }),
      credentials: Credentials.fromSecret(secret),
      writer: ClusterInstance.serverlessV2("writer"),
      readers: [ClusterInstance.serverlessV2("reader", { scaleWithWriter: true })],
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      serverlessV2MinCapacity: props.config.auroraMinAcu,
      serverlessV2MaxCapacity: props.config.auroraMaxAcu,
      backup: { retention: Duration.days(props.config.envName === "production" ? 14 : 3) },
      deletionProtection: props.config.deletionProtection,
      removalPolicy:
        props.config.envName === "production" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      storageEncrypted: true,
    });
    this.proxy = this.cluster.addProxy("RdsProxy", {
      secrets: [secret],
      vpc: props.vpc,
      requireTLS: true,
    });
  }
}
