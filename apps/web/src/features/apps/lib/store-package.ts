import JSZip from 'jszip';

export interface StorePackageOptions {
  tenantName: string;
  tenantSlug: string;
  schoolCode: string;
  packageId: string;
  appVersion: string;
  buildNumber: number;
  primaryColor: string;
  secondaryColor: string;
  crestInitials: string;
  supportEmail: string;
  supportUrl: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  accountDeletionUrl: string;
  shortDescEn: string;
  shortDescLus: string;
  fullDescEn: string;
  fullDescLus: string;
}

export async function generateStorePackageZip(options: StorePackageOptions): Promise<Blob> {
  const zip = new JSZip();

  // 1. app.config.json (Baked White-Label Expo Config)
  const appConfig = {
    expo: {
      name: options.tenantName,
      slug: options.tenantSlug,
      version: options.appVersion,
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: options.primaryColor
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
        bundleIdentifier: options.packageId,
        buildNumber: String(options.buildNumber),
        infoPlist: {
          NSCameraUsageDescription: 'Scan identity card QR codes and upload student admission documents.',
          NSPhotoLibraryUsageDescription: 'Select student photos and documents for upload.'
        }
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: options.primaryColor
        },
        package: options.packageId,
        versionCode: options.buildNumber,
        permissions: ['CAMERA', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']
      },
      extra: {
        appVariant: 'whitelabel',
        tenantSlug: options.tenantSlug,
        schoolCode: options.schoolCode,
        apiBaseUrl: `https://${options.tenantSlug}.eduportal.com/api`
      }
    }
  };
  zip.file('app.config.json', JSON.stringify(appConfig, null, 2));

  // 2. Metadata folder
  const metadataFolder = zip.folder('metadata');
  if (metadataFolder) {
    // English Store Listing
    metadataFolder.file(
      'listing_en.json',
      JSON.stringify(
        {
          title: options.tenantName,
          short_description: options.shortDescEn,
          full_description: options.fullDescEn,
          keywords: [options.tenantName, 'EduPortal', 'Marksheet', 'School Portal', 'ID Card', 'Mizoram'],
          category: 'Education',
          contact_email: options.supportEmail,
          support_url: options.supportUrl,
          privacy_policy_url: options.privacyPolicyUrl,
          terms_of_service_url: options.termsOfServiceUrl,
          account_deletion_url: options.accountDeletionUrl
        },
        null,
        2
      )
    );

    // Mizo Store Listing
    metadataFolder.file(
      'listing_lus.json',
      JSON.stringify(
        {
          title: options.tenantName,
          short_description: options.shortDescLus,
          full_description: options.fullDescLus,
          keywords: [options.tenantName, 'Zirlai', 'Nu leh Pa', 'Exam Result', 'ID Card', 'School'],
          category: 'Education',
          contact_email: options.supportEmail,
          support_url: options.supportUrl,
          privacy_policy_url: options.privacyPolicyUrl,
          terms_of_service_url: options.termsOfServiceUrl,
          account_deletion_url: options.accountDeletionUrl
        },
        null,
        2
      )
    );

    // Google Play Data Safety Questionnaire Responses
    metadataFolder.file(
      'data_safety_answers.json',
      JSON.stringify(
        {
          overview: {
            dataCollected: true,
            dataShared: false,
            encryptedInTransit: true,
            accountDeletionSupported: true,
            deletionUrl: options.accountDeletionUrl
          },
          collectedDataTypes: [
            {
              type: 'Personal info',
              subtypes: ['Name', 'Email address', 'User identifiers (Admission No / Employee ID)'],
              purposes: ['App functionality', 'Account management'],
              optional: false
            },
            {
              type: 'Financial info',
              subtypes: ['Purchase history (School tuition & invoice payment records)'],
              purposes: ['App functionality'],
              optional: false
            },
            {
              type: 'Photos and videos',
              subtypes: ['Photos (Student & staff identity card headshots)'],
              purposes: ['App functionality'],
              optional: false
            }
          ],
          securityPractices: {
            tlsEncryption: true,
            rbiCompliantPaymentGateway: true,
            statutoryAcademicRetentionPolicy: 'Academic records retained in accordance with MBSE / CBSE regulations; user authentication credentials purged within 30 days of deletion request.'
          }
        },
        null,
        2
      )
    );

    // Apple App Store Privacy Nutrition Labels
    metadataFolder.file(
      'apple_privacy_nutrition_labels.json',
      JSON.stringify(
        {
          dataUsedToTrackYou: [],
          dataLinkedToYou: [
            {
              category: 'Contact Info',
              dataTypes: ['Email Address', 'Name', 'Phone Number'],
              purposes: ['App Functionality']
            },
            {
              category: 'Financial Info',
              dataTypes: ['Payment Info (Invoice transaction references)'],
              purposes: ['App Functionality']
            },
            {
              category: 'Identifiers',
              dataTypes: ['User ID', 'Device ID (Push Notification Token)'],
              purposes: ['App Functionality']
            },
            {
              category: 'User Content',
              dataTypes: ['Photos (ID card photo)'],
              purposes: ['App Functionality']
            }
          ],
          dataNotLinkedToYou: [
            {
              category: 'Diagnostics',
              dataTypes: ['Crash Data', 'Performance Data'],
              purposes: ['App Functionality', 'Analytics']
            }
          ]
        },
        null,
        2
      )
    );

    // IARC Content Rating
    metadataFolder.file(
      'content_rating_questionnaire.json',
      JSON.stringify(
        {
          ratingSystem: 'IARC',
          targetAudience: 'Parents, Students (General Audience), Faculty',
          violence: 'None',
          sexuality: 'None',
          profanity: 'None',
          controlledSubstances: 'None',
          unrestrictedInternetAccess: 'No (Controlled institutional subdomains only)',
          userInteraction: 'No unmoderated chat or social forum',
          expectedRatings: {
            googlePlay: 'Rated for 3+',
            appleAppStore: '4+',
            pegi: '3',
            esrb: 'Everyone'
          }
        },
        null,
        2
      )
    );
  }

  // 3. Credentials and Keystore Instructions
  const credentialsFolder = zip.folder('credentials');
  if (credentialsFolder) {
    credentialsFolder.file(
      'KEYSTORE_INSTRUCTIONS.md',
      `# Keystore & Signing Certificate Instructions

## Android Release Keystore Generation
Run the following standard keytool command to generate the release signing key:

\`\`\`bash
keytool -genkey -v -keystore ${options.tenantSlug}-release.keystore \\
  -alias ${options.tenantSlug} \\
  -keyalg RSA \\
  -keysize 2048 \\
  -validity 10000 \\
  -dname "CN=${options.tenantName}, OU=Mobile, O=${options.tenantName}, L=Aizawl, ST=Mizoram, C=IN"
\`\`\`

> [!IMPORTANT]
> Store the generated \`.keystore\` file and its password in Supabase Vault or AWS Secrets Manager. Never commit to Git.

## Apple Distribution Certificate
1. Sign in to developer.apple.com with the school's Apple Developer Account.
2. Navigate to Certificates, Identifiers & Profiles -> Identifiers.
3. Register App ID: \`${options.packageId}\` with Capabilities: Push Notifications.
4. Generate an Apple Distribution Certificate and download the Provisioning Profile.
`
    );
  }

  // 4. Root Operator README
  zip.file(
    'README.md',
    `# Store Publishing Package: ${options.tenantName}

This package contains all assets, configurations, and legal compliance answers required to submit the white-label app to the Google Play Console and Apple App Store.

## Package Manifest
- \`app.config.json\`: Pre-configured Expo application configuration.
- \`metadata/listing_en.json\`: Store title, descriptions, and keywords in English.
- \`metadata/listing_lus.json\`: Store title, descriptions, and keywords in Mizo.
- \`metadata/data_safety_answers.json\`: Exact form inputs for Google Play Data Safety.
- \`metadata/apple_privacy_nutrition_labels.json\`: Exact form inputs for Apple Privacy Labels.
- \`metadata/content_rating_questionnaire.json\`: IARC content rating questionnaire answers.
- \`credentials/KEYSTORE_INSTRUCTIONS.md\`: Key generation command lines.

## Google Play Console Step-by-Step
1. Create new application with Package ID \`${options.packageId}\`.
2. Set default language to English (India).
3. Paste listing text from \`metadata/listing_en.json\`. Add Mizo translation from \`metadata/listing_lus.json\`.
4. Fill App Content -> Data Safety using \`metadata/data_safety_answers.json\`.
5. Provide App Review Credentials:
   - Username: \`apple.reviewer@mountcarmel.edu.in\`
   - Password: \`ReviewerDemo2025!\`
6. Upload production \`.aab\` build artifact from Cloudflare R2.
7. Submit for Review.

## Apple App Store Connect Step-by-Step
1. Create new app with Bundle ID \`${options.packageId}\` and SKU \`${options.tenantSlug}-portal\`.
2. Complete App Information and Pricing (Free).
3. Fill App Privacy section using \`metadata/apple_privacy_nutrition_labels.json\`.
4. Set Account Deletion URL: \`${options.accountDeletionUrl}\`.
5. Enter Reviewer Demo Account in App Review Information:
   - Username: \`apple.reviewer@mountcarmel.edu.in\`
   - Password: \`ReviewerDemo2025!\`
6. Attach IPA build artifact via TestFlight / EAS Submit.
7. Submit for App Store Review.
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
