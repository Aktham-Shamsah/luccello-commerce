#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { AppStack } from "../lib/app-stack.js";
import { DatabaseStack } from "../lib/database-stack.js";
import { NetworkStack } from "../lib/network-stack.js";
import { SecurityStack } from "../lib/security-stack.js";
import { environments, type EnvironmentName } from "../config/environments.js";

const app = new App();
const envName = (app.node.tryGetContext("env") ?? "dev") as EnvironmentName;
const config = environments[envName];

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? config.region,
};

const network = new NetworkStack(app, `Luccello-${envName}-Network`, { env });
new SecurityStack(app, `Luccello-${envName}-Security`, { env, config });
new DatabaseStack(app, `Luccello-${envName}-Database`, { env, vpc: network.vpc, config });
new AppStack(app, `Luccello-${envName}-App`, { env, config });
