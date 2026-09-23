import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import axios from 'axios';

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

const DEFAULT_WEB_CLIENT_ID =
  '572010941912-8o2qmpdducgt69senfsfeol8jrfva0op.apps.googleusercontent.com';
const FIREBASE_API_KEY = 'AIzaSyAjV643Td-Q1e8FlFuh-g_epQJgvNyrr3k';

export const configureGoogleSignin = (webClientId?: string) => {
  if (isConfigured) {
    return;
  }

  const clientId =
    webClientId || process.env.GOOGLE_WEB_CLIENT_ID || DEFAULT_WEB_CLIENT_ID;

  GoogleSignin.configure({
    webClientId: clientId,
    offlineAccess: true,
    scopes: ['profile', 'email'],
  });

  isConfigured = true;
};

/**
 * Helper to get a valid Firebase Auth ID Token from a Google OAuth ID Token & Access Token
 */
const getFirebaseIdToken = async (
  googleIdToken: string,
  accessToken?: string | null,
): Promise<string> => {
  let nativeErrMsg = '';
  // Method 1: React Native Firebase Auth Modular API (v22+)
  try {
    const authInstance = getAuth();
    const googleCredential = GoogleAuthProvider.credential(
      googleIdToken,
      accessToken || undefined,
    );
    const firebaseUserCredential = await signInWithCredential(
      authInstance,
      googleCredential,
    );
    const token = await firebaseUserCredential.user.getIdToken(true);
    if (token) {
      console.log(
        'Successfully generated Firebase Auth ID token via Native SDK',
      );
      return token;
    }
  } catch (nativeErr: any) {
    nativeErrMsg = nativeErr?.message || String(nativeErr);
    console.warn(
      'Native Firebase Auth sign-in failed, attempting REST API fallback:',
      nativeErrMsg,
    );
  }

  // Method 2: Fallback to Firebase Identity Toolkit REST API
  let restErrMsg = '';
  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${FIREBASE_API_KEY}`;
    let postBody = `id_token=${encodeURIComponent(
      googleIdToken,
    )}&providerId=google.com`;
    if (accessToken) {
      postBody += `&access_token=${encodeURIComponent(accessToken)}`;
    }
    const res = await axios.post(url, {
      postBody,
      requestUri: 'http://localhost',
      returnIdpCredential: true,
      returnSecureToken: true,
    });

    if (res?.data?.idToken) {
      console.log('Successfully generated Firebase Auth ID token via REST API');
      return res.data.idToken;
    }
  } catch (restErr: any) {
    restErrMsg =
      restErr?.response?.data?.error?.message ||
      restErr?.message ||
      String(restErr);
    console.error(
      'REST API token exchange failed:',
      restErr?.response?.data || restErr,
    );
  }

  throw new Error(
    `Failed to generate Firebase Auth ID Token. Native error: ${
      nativeErrMsg || 'N/A'
    }. REST error: ${restErrMsg || 'N/A'}`,
  );
};

export const signInWithGoogle = async (
  webClientId?: string,
): Promise<GoogleSignInUserResult> => {
  try {
    configureGoogleSignin(webClientId);

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const response = await GoogleSignin.signIn();

    const data = (response as any)?.data || response;
    const user = data?.user;
    const googleIdToken = data?.idToken;

    if (!user || !user.email) {
      throw new Error('Could not retrieve user details from Google Sign-In.');
    }

    if (!googleIdToken) {
      throw new Error('Could not obtain Google OAuth ID Token.');
    }

    // Fetch tokens (including accessToken to prevent empty credentials)
    let accessToken: string | null = null;
    try {
      const tokens = await GoogleSignin.getTokens();
      accessToken = tokens.accessToken;
    } catch (_tErr) {
      console.warn('Could not fetch Google access token via getTokens()');
    }

    // Convert Google OAuth ID Token into a genuine Firebase Auth ID Token (using Modular SDK + Fallback)
    const firebaseIdToken = await getFirebaseIdToken(
      googleIdToken,
      accessToken,
    );

    return {
      idToken: firebaseIdToken,
      user: {
        id: user.id,
        email: user.email,
        name:
          user.name ||
          `${user.givenName || ''} ${user.familyName || ''}`.trim() ||
          'Google User',
        photo: user.photo || null,
        givenName: user.givenName,
        familyName: user.familyName,
      },
    };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Google Sign-In was cancelled.');
    }

    if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Google Sign-In is already in progress.');
    }

    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error(
        'Google Play Services are not available or outdated on this device.',
      );
    }

    throw error;
  }
};

export const signOutGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
    const authInstance = getAuth();
    await firebaseSignOut(authInstance).catch(() => {});
  } catch (error) {
    console.warn('Google Sign-Out Error:', error);
  }
};
