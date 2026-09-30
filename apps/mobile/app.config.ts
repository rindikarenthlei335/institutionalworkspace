import { ExpoConfig, ConfigContext } from 'expo/config';

declare const process: {
  env: Record<string, string | undefined>;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const appVariant = process.env.APP_VARIANT || 'shared';
  const tenantSlug = process.env.TENANT_SLUG || 'mountcarmel';

  const isWhiteLabel = appVariant === 'whitelabel';

  const appName = isWhiteLabel
    ? 'Mount Carmel Higher Secondary'
    : 'EduPortal';

  const appSlug = isWhiteLabel
    ? tenantSlug
    : 'eduportal';

  const bundleId = isWhiteLabel
    ? `in.edu.${tenantSlug}.portal`
    : 'com.eduportal.app';

  return {
    ...config,
    name: appName,
    slug: appSlug,
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: isWhiteLabel ? '#163A2B' : '#0F172A'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleId,
      infoPlist: {
        NSCameraUsageDescription: 'Scan identity card QR codes and upload student admission documents.',
        NSPhotoLibraryUsageDescription: 'Select student photos and documents for upload.'
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: isWhiteLabel ? '#163A2B' : '#0F172A'
      },
      package: bundleId,
      permissions: ['CAMERA', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']
    },
    extra: {
      appVariant,
      tenantSlug: isWhiteLabel ? tenantSlug : null,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://mountcarmel.eduportal.com/api',
      eas: {
        projectId: '00000000-0000-0000-0000-000000000001'
      }
    },
    plugins: [
      [
        'expo-updates',
        {
          username: 'eduportal'
        }
      ]
    ]
  };
};
