import { Scalekit } from '@scalekit-sdk/node';

export function getScaleKit() {
  const environmentUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
  const clientId = process.env.SCALEKIT_CLIENT_ID;
  const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;

  if (!environmentUrl || !clientId || !clientSecret) {
    throw new Error(
      'Missing required ScaleKit environment variables: SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET'
    );
  }

  return new Scalekit(environmentUrl, clientId, clientSecret);
}