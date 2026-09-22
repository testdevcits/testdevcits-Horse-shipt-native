import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

declare const process: any;

export interface GoogleSignInUserResult {
  idToken: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
    photo: string | null;
    familyName?: string | null;
    givenName?: string | null;
  };
}

let isConfigured = false;

const DEFAULT_WEB_CLIENT_ID = '572010941912-8o2qmpdducgt69senfsfeol8jrfva0op.apps.googleusercontent.com';

export const configureGoogleSignin = (webClientId?: string) => {
  if (isConfigured) {
    return;
  }

  const clientId = webClientId || process.env.GOOGLE_WEB_CLIENT_ID || DEFAULT_WEB_CLIENT_ID;

  GoogleSignin.configure({
    webClientId: clientId,
    offlineAccess: true,
    scopes: ['profile', 'email'],
  });

  isConfigured = true;
};

export const signInWithGoogle = async (
  webClientId?: string,
): Promise<GoogleSignInUserResult> => {
  try {
    configureGoogleSignin(webClientId);

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();

    // Support both new (v13+) response structure { data: { idToken, user } } and legacy structure
    const data = (response as any)?.data || response;
    const user = data?.user;
    const idToken = data?.idToken || null;

    if (!user || !user.email) {
      throw new Error('Could not retrieve user details from Google Sign-In.');
    }

    return {
      idToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || `${user.givenName || ''} ${user.familyName || ''}`.trim() || 'Google User',
        photo: user.photo || null,
        givenName: user.givenName,
        familyName: user.familyName,
      },
    };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Google Sign-In was cancelled.');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Google Sign-In is already in progress.');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services are not available or outdated on this device.');
    } else {
      throw error;
    }
  }
};

export const signOutGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.warn('Google Sign-Out Error:', error);
  }
};
