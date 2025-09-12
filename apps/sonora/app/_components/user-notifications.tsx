import featuresFlagConfig from '~/config/feature-flags.config';

export function UserNotifications(props: { userId: string }) {
  if (!featuresFlagConfig.enableNotifications) {
    return null;
  }

  return null;
}
