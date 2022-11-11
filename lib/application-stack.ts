import * as cdk from 'aws-cdk-lib';
import {
  aws_iam,
  aws_lambda,
  Stack,
  StackProps,
  CfnOutput, Duration
} from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as path from "path";
import {PolicyStatement, ServicePrincipal} from "aws-cdk-lib/aws-iam";



export interface ApplicationProps extends StackProps {
  environment: string;
}

export class ApplicationStack extends Stack {
  public readonly url: CfnOutput;

  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    // Suffix
    const suffix = Date.now().toString();

    // Lambda fn
    const fn = new aws_lambda.DockerImageFunction(this, 'DockerImageFunctionHandler', {
      code: aws_lambda.DockerImageCode.fromImageAsset(path.join(__dirname, 'src/hello_world'), {
      cmd: ["app.handler"],
      }),
      memorySize: 512,
      timeout: Duration.seconds(40)
      });

    const myRole = new aws_iam.Role(this, "myRole",
        {assumedBy: new aws_iam.ServicePrincipal('codepipeline.amazonaws.com')
        });

    myRole.addToPolicy(new PolicyStatement({
      resources: [fn.functionArn],
      actions: ['lambda:InvokeFunction'],
    }));

    const fnUrl = fn.addFunctionUrl();
    fnUrl.grantInvokeUrl(myRole);

    new CfnOutput(this, 'TheUrl', {
      // The .url attributes will return the unique Function URL
      value: fnUrl.url,
      exportName: `Url${props.environment}`,
    });

  }
}
