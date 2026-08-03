declare namespace NodeJS {
  interface ProcessEnv {
    BASE_URL?: string;
    GOOGLE_MAPS_APIKEY?: string;
    REACT_APP_STRIPE_PUBLISHABLE_KEY?: string;
    [key: string]: string | undefined;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
