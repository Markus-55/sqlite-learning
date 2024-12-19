declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_COOKIE_TTL: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      JWT_TTL: string;
      JWT_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}