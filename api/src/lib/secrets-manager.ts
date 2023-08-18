import {
  SecretsManagerClient,
  SecretsManagerClientConfig,
  GetSecretValueCommand,
  GetSecretValueRequest
} from '@aws-sdk/client-secrets-manager';

export class SecretsManager {
  private static NON_PROD_ENVS = ['local', 'test'];

  private client: SecretsManagerClient;

  constructor() {
    const config: SecretsManagerClientConfig = {};

    if (SecretsManager.NON_PROD_ENVS.includes(process.env.DEMO_ENVIRONMENT)) {
      config.endpoint = 'http://localstack:4566';
    }

    this.client = new SecretsManagerClient(config);
  }

  async getSecret(secretId: string) {
    const input: GetSecretValueRequest = { SecretId: secretId };
    const command = new GetSecretValueCommand(input);
    const { SecretString } = await this.client.send(command);
    return JSON.parse(SecretString);
  }
}
