import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

async function getSecrets(secretName, regionName) {
    const client = new SecretsManagerClient({ region: regionName });
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await client.send(command);

    if (data.SecretString) {
        return JSON.parse(data.SecretString);
    } else {
        return JSON.parse(Buffer.from(data.SecretBinary, 'base64').toString('ascii'));
    }
}

export { getSecrets };