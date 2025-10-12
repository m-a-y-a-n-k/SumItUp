# TypeScript Setup Guide

This document outlines the TypeScript configuration and setup for the SumItUp project.

## Overview

TypeScript has been added to both the backend (Node.js/Express) and frontend (React Native/Expo) parts of the project to provide type safety, better developer experience, and improved code maintainability.

## Backend TypeScript Setup

### Configuration Files

- **`tsconfig.json`**: Main TypeScript configuration with strict type checking enabled
- **Path mapping**: Configured for clean imports using `@/` prefixes
- **Output directory**: Compiled JavaScript goes to `./dist/`

### Key Dependencies Added

```json
{
  "devDependencies": {
    "typescript": "latest",
    "@types/node": "latest",
    "@types/express": "latest",
    "@types/bcrypt": "latest",
    "@types/cors": "latest",
    "@types/jsonwebtoken": "latest",
    "@types/multer": "latest",
    "@types/morgan": "latest",
    "@types/nodemailer": "latest",
    "@types/passport": "latest",
    "@types/passport-facebook": "latest",
    "@types/passport-github2": "latest",
    "@types/passport-google-oauth20": "latest",
    "ts-node": "latest",
    "nodemon": "latest",
    "tsconfig-paths": "latest"
  }
}
```

### New Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon --exec ts-node index.ts",
    "start:ts": "ts-node index.ts"
  }
}
```

### Converted Files

The following key files have been converted to TypeScript:

1. **`index.ts`** - Main application entry point
2. **`config.ts`** - Configuration with proper typing
3. **`db.ts`** - Database connection with type safety
4. **`src/models/User.ts`** - User model with interfaces
5. **`src/models/Content.ts`** - Content model with interfaces
6. **`src/controllers/auth/login.ts`** - Example controller conversion
7. **`src/types/index.ts`** - Shared type definitions

### Usage

#### Development
```bash
cd backend
npm run dev  # Uses ts-node for development
```

#### Production
```bash
cd backend
npm run build  # Compile TypeScript to JavaScript
npm start      # Run compiled JavaScript
```

## Frontend TypeScript Setup

### Configuration

The frontend already had TypeScript support through Expo. The configuration has been enhanced with:

- **Strict type checking** enabled
- **Path mapping** for clean imports
- **Additional compiler options** for better type safety

### Enhanced `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@services/*": ["src/services/*"]
    }
  }
}
```

### Type Definitions

Created comprehensive type definitions in `src/types/index.ts` including:

- **Content types** - Matching backend models
- **User types** - User-related interfaces
- **API response types** - Standardized API responses
- **Navigation types** - React Navigation type safety
- **Form types** - Form validation and handling

## Migration Strategy

### Gradual Migration

The project supports both JavaScript and TypeScript files during the migration period:

1. **New files** should be written in TypeScript (`.ts`/`.tsx`)
2. **Existing files** can be gradually converted
3. **JavaScript files** continue to work alongside TypeScript files

### Conversion Process

To convert a JavaScript file to TypeScript:

1. **Rename** `.js` to `.ts` (or `.jsx` to `.tsx`)
2. **Add type annotations** for function parameters and return types
3. **Define interfaces** for complex objects
4. **Import types** from the shared type definitions
5. **Fix any type errors** reported by TypeScript

### Example Conversion

**Before (JavaScript):**
```javascript
const login = async (req, res) => {
  const { email, password } = req.body;
  // ... rest of the function
};
```

**After (TypeScript):**
```typescript
import { Request, Response } from "express";

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

const login = async (req: LoginRequest, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  // ... rest of the function
};
```

## Benefits

### Type Safety
- **Compile-time error detection** prevents runtime errors
- **IntelliSense support** in IDEs for better development experience
- **Refactoring safety** when changing interfaces or function signatures

### Code Quality
- **Self-documenting code** through type annotations
- **Consistent interfaces** between frontend and backend
- **Better maintainability** for large codebases

### Developer Experience
- **Auto-completion** for object properties and methods
- **Parameter hints** when calling functions
- **Jump to definition** functionality in IDEs

## Best Practices

### Type Definitions
- **Use interfaces** for object shapes
- **Export types** from dedicated type files
- **Use union types** for limited string values (e.g., `'audio' | 'video'`)

### Error Handling
- **Type API responses** consistently
- **Use proper error types** instead of `any`
- **Handle null/undefined** cases explicitly

### Import/Export
- **Use ES6 imports/exports** instead of CommonJS
- **Leverage path mapping** for clean imports
- **Group imports** logically (external, internal, types)

## Troubleshooting

### Common Issues

1. **Module not found errors**: Check path mapping in `tsconfig.json`
2. **Type errors**: Add proper type annotations or use type assertions carefully
3. **Build errors**: Ensure all dependencies have type definitions

### Useful Commands

```bash
# Check TypeScript compilation without emitting files
npx tsc --noEmit

# Watch mode for development
npx tsc --watch

# Generate declaration files
npx tsc --declaration
```

## Next Steps

1. **Convert remaining controllers** to TypeScript
2. **Add middleware typing** for better request/response handling
3. **Implement API client types** for frontend-backend communication
4. **Add unit test types** for better test coverage
5. **Set up ESLint with TypeScript** rules for code quality

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express with TypeScript](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Native TypeScript](https://reactnative.dev/docs/typescript)
- [Mongoose with TypeScript](https://mongoosejs.com/docs/typescript.html)
