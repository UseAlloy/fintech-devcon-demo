import {
  DecryptCommand,
  DecryptRequest,
  GenerateDataKeyCommand,
  GenerateDataKeyRequest,
  KMSClient,
  KMSClientConfig
} from '@aws-sdk/client-kms';

export class KMS {
  private static NON_PROD_ENVS = ['local', 'test'];

  private client: KMSClient;

  constructor() {
    const config = this.generateKmsConfig();
    this.client = new KMSClient(config);
  }

  private generateKmsConfig() {
    const config: KMSClientConfig = {};

    if (KMS.NON_PROD_ENVS.includes(process.env.DEMO_ENVIRONMENT)) {
      config.endpoint = 'http://localstack:4566';
    }

    return config;
  }

  async generateDataKey(wrappedKeyId: string) {
    const input: GenerateDataKeyRequest = {
      KeySpec: 'AES_256',
      KeyId: wrappedKeyId
    };

    const command = new GenerateDataKeyCommand(input);
    const { CiphertextBlob } = await this.client.send(command);

    return Buffer.from(CiphertextBlob);
  }

  async decryptDataKey(wrappedKeyId: string, encryptedDataKey: Buffer) {
    const input: DecryptRequest = {
      CiphertextBlob: encryptedDataKey,
      KeyId: wrappedKeyId
    };

    const command = new DecryptCommand(input);
    const { Plaintext } = await this.client.send(command);

    return Buffer.from(Plaintext);
  }
}
