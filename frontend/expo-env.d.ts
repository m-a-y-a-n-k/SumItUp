/// <reference types="expo/types" />

// Add custom global type definitions here
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.gif' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

// Environment variables
declare module '@env' {
  export const API_URL: string;
  export const NODE_ENV: string;
}

// Global types for the app
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      EXPO_PUBLIC_API_URL?: string;
    }
  }
}
