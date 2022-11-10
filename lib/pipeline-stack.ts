import {
<<<<<<< HEAD
  aws_codebuild,
  aws_codepipeline,
  aws_codepipeline_actions,
  aws_iam,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
=======
    RemovalPolicy,
    aws_codepipeline,
    aws_codebuild,
    aws_codepipeline_actions,
    Stack,
    StackProps,
    aws_iam
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
>>>>>>> main

interface PipelineProps extends StackProps {
  codeStarId: string;
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

<<<<<<< HEAD
    // codebuild unitest
    const unittestCodeBuild = new aws_codebuild.PipelineProject(
=======
    // Artifacts
    const sourceOutput = new aws_codepipeline.Artifact("SourceOutput");
    const unitTestBuildOutput = new aws_codepipeline.Artifact("UnittestBuildOutput");
    const cdkBuildOutput = new aws_codepipeline.Artifact("CdkBuildOutput");

    // Github connection
    const sourceAction = new aws_codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: "Github_Source",
      owner: "JonathanGriffiths94",
      connectionArn: `arn:aws:codestar-connections:${this.region}:${this.account}:connection/${props.codeStarId}`,
      repo: "aws-ci-cd-lambda-docker-test",
      branch: "main",
      output: sourceOutput
    });


    // CodeBuild for unit test
    const unitTestCodeBuildProject = new aws_codebuild.PipelineProject(
        this,
        "UnitTestCodeBuildProject",
        {
          projectName: "UnitTestCodeBuildProject",
          environment: {
            buildImage: aws_codebuild.LinuxBuildImage.STANDARD_5_0
          },
          buildSpec: aws_codebuild.BuildSpec.fromObject({
            version: "0.2",
            phases: {
              install: {
                commands: ["pip install -r requirements.txt", "echo $CODE_COMMIT_ID"],
              },
              build: {
                commands: ["python -m pytest -s -v unittest/test_lambda_logic.py"],
              }
            }
          })
        }
    )

    // Role for integration test
    const role = new aws_iam.Role(this, "RoleForIntegrationTest", {
      roleName: "RoleForIntegrationTest",
      assumedBy: new aws_iam.ServicePrincipal("codebuild.amazonaws.com")
    });

    role.attachInlinePolicy(
        new aws_iam.Policy(this, "CodeBuildReadCloudFormation", {
          policyName: "CodeBuildReadCloudFormation",
          statements: [
              new aws_iam.PolicyStatement({
                actions: ["cloudformation:*"],
                resources: ["*"]
              })
          ]
        })
    )

    role.attachInlinePolicy(
        new aws_iam.Policy(this, "CodeStarConnection", {
          policyName: "CodeStarConnection",
          statements: [
              new aws_iam.PolicyStatement({
                actions: ["codestar-connections:UseConnection"],
                resources: [`arn:aws:codestar-connections:${this.region}:${this.account}:connection/${props.codeStarId}`]
              })
          ]
        })
    )

      // CodeBuild for integration test
    const integTestCodeBuildProject = new aws_codebuild.PipelineProject(
>>>>>>> main
      this,
      "CodeBuildUnittest",
      {
        environment: {
          buildImage: aws_codebuild.LinuxBuildImage.STANDARD_5_0,
        },
        buildSpec: aws_codebuild.BuildSpec.fromObject({
          version: "0.2",
          phases: {
            install: {
              commands: [
                "echo $CODE_COMMIT_ID",
                "pip install -r requirements.txt",
              ],
            },
            build: {
              commands: [
                "python -m pytest -s -v unittests/test_lambda_logic.py",
              ],
            },
          },
          artifacts: {},
        }),
      }
    );

<<<<<<< HEAD
    // role for integration test
    const role = new aws_iam.Role(this, "RoleForIntegerationTest", {
      roleName: "RoleForIntegrationTest",
      assumedBy: new aws_iam.ServicePrincipal("codebuild.amazonaws.com"),
    });

    role.attachInlinePolicy(
      new aws_iam.Policy(this, "CodeBuildReadCloufFormation", {
        policyName: "CodeBuildReadCloufFormation",
        statements: [
          new aws_iam.PolicyStatement({
            actions: ["cloudformation:*"],
            resources: ["*"],
          }),
        ],
      })
    );

    // codebuild integration test
    const integtestCodeBuild = new aws_codebuild.PipelineProject(
      this,
      "CodeBuildIntegTest",
      {
        role: role,
        environment: {
          buildImage: aws_codebuild.LinuxBuildImage.STANDARD_5_0,
        },
        buildSpec: aws_codebuild.BuildSpec.fromObject({
          version: "0.2",
          phases: {
            install: {
              commands: [
                `SERVICE_URL=$(aws cloudformation describe-stacks --stack-name PreProdApplicationStack --query "Stacks[0].Outputs[?OutputKey=='UrlPreProd'].OutputValue" --output text)`,
                "echo $SERVICE_URL",
                "pip install -r requirements.txt",
              ],
            },
            build: {
              commands: ["python -m pytest -s -v integtests/test_service.py"],
            },
          },
          artifacts: {},
        }),
      }
    );

    // codebuild cdk template
    const cdkCodeBuild = new aws_codebuild.PipelineProject(
      this,
      "CodeBuildCdk",
      {
        environment: {
          buildImage: aws_codebuild.LinuxBuildImage.STANDARD_5_0,
        },
        buildSpec: aws_codebuild.BuildSpec.fromObject({
          version: "0.2",
          phases: {
            install: {
              commands: ["npm install"],
            },
            build: {
              commands: ["npm run cdk synth -- -o dist"],
            },
          },
          artifacts: {
            "base-directory": "dist",
            files: ["*.template.json"],
          },
        }),
      }
    );

    // source output
    const sourceOutput = new aws_codepipeline.Artifact("SourceCode");
    const cdkBuildOutput = new aws_codepipeline.Artifact("CdkBuildOutput");
    const unitestCodeBuildOutput = new aws_codepipeline.Artifact(
      "UnittestBuildOutput"
    );
    const preProdOutput = new aws_codepipeline.Artifact("PreProductOutput");

    // source action
    // const sourceAction = new aws_codepipeline_actions.CodeCommitSourceAction({
    //   actionName: "CodeCommit",
    //   repository: repo,
    //   branch: "master",
    //   output: sourceOutput,
    //   variablesNamespace: "SourceVariables",
    // });

    // github source
    const sourceAction =
      new aws_codepipeline_actions.CodeStarConnectionsSourceAction({
        actionName: "Github_Source",
        owner: "JonathanGriffiths94",
        connectionArn: `arn:aws:codestar-connections:${this.region}:${this.account}:connection/${props.codeStarId}`,
        repo: "aws-ci-cd-lambda-docker-test",
        branch: "main",
        output: sourceOutput,
      });

    // build action
    const unittestBuildAction = new aws_codepipeline_actions.CodeBuildAction({
=======
    // Unit test CodeBuild action
    const unitTestBuildAction = new aws_codepipeline_actions.CodeBuildAction({
      actionName: "DoUnitTest",
      project: unitTestCodeBuild,
      input: sourceOutput,
      outputs: [unitTestBuildOutput],
>>>>>>> main
      environmentVariables: {
        CODE_COMMIT_ID: {
          value: sourceAction.variables.commitId,
        },
      },
      actionName: "DoUnitest",
      project: unittestCodeBuild,
      input: sourceOutput,
      outputs: [unitestCodeBuildOutput],
    });

    // cdk build template
    const cdkBuild = new aws_codepipeline_actions.CodeBuildAction({
      actionName: "BuildCfnTemplate",
      project: cdkCodeBuild,
      input: sourceOutput,
      outputs: [cdkBuildOutput],
    });

    // deploy preprod
    const deployPreProd =
      new aws_codepipeline_actions.CloudFormationCreateUpdateStackAction({
        actionName: "DeployPreProdApplication",
        templatePath: cdkBuildOutput.atPath(
          "PreProdApplicationStack.template.json"
        ),
        stackName: "PreProdApplicationStack",
        adminPermissions: true,
        // variablesNamespace: "PreProdVariables",
        // outputFileName: "PreProdOutputs",
        // output: preProdOutput,
      });

    // build action
    const integtestBuildAction = new aws_codepipeline_actions.CodeBuildAction({
      actionName: "IntegTest",
      project: integtestCodeBuild,
      input: sourceOutput,
    });

    // deploy product
    const deployProd =
      new aws_codepipeline_actions.CloudFormationCreateUpdateStackAction({
        actionName: "DeployProd",
        templatePath: cdkBuildOutput.atPath(
          "ProApplicationStack.template.json"
        ),
        stackName: "ProApplicationStack",
        adminPermissions: true,
      });

    // pipeline
    const pipeline = new aws_codepipeline.Pipeline(this, "CicdPipelineDemo", {
      pipelineName: "CicdPipelineDemo",
      crossAccountKeys: false,
      stages: [
        {
          stageName: "Source",
          actions: [sourceAction],
        },
        {
          stageName: "Unittest",
          actions: [unittestBuildAction],
        },
        {
          stageName: "BuildTemplate",
          actions: [cdkBuild],
        },
        {
          stageName: "DeployPreProd",
          actions: [deployPreProd],
        },
        {
          stageName: "IntegTest",
          actions: [integtestBuildAction],
        },
        {
          stageName: "DeployProd",
          actions: [deployProd],
        },
      ],
    });

    // destroy artifact bucket when deleling pipeline
    pipeline.artifactBucket.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}