# Development Setup

In order to run the application you need to provide next environment variables.

#### Node Proxy

- `EXPRESS_PORT` - Port. **__[Default]__**: `8888`.
- `API_SERVER` - Gateway API URL. **__[Example]__**: `https://${backend-url}/${backend-sub-path}`.
- `MOCK_SERVER` - Mock server URL. **__[Example]__**: `http://localhost:3010`.
- `SESSION_SECRET` - Your session secret.
- `SESSION_STORE` - Session store. **__[Default]__**: `dynamic`.
  1. `dynamic` - The store will be based on the env the app is running in: `development/production` - redis store, `local` - in memory store.
  2. `in-memory` - In memory store. 
- `BASE_URL` - Base URL. **__[Example]__**: `/${frontend-sub-path}/`.
- `LOGOUT_URL` - Logout URL for your OAuth provider. **__[Default]__**: `None`.
- `COOKIE_MAX_AGE` - Cookie max age. **__[Default]__**: `3600 * 1000 * 8` (8 hours).
- `BUILD_PATH` -  Directory with a production build (ReactJS) of the app. **__[Default]__**: `'../../frontend/public'`.

#### Redis session store

You can use Redis as a session store. It can be useful for scaling purposes.

- `REDIS_PORT` - Redis port. **__[Default]__**: `6379`.
- `REDIS_HOST` - Redis host.
- `REDIS_PASSWORD` - Redis password.
- `REDIS_DB` - Database. **__[Default]__**: `0`.

#### OpenID Connect (OIDC)

- `STRATEGY` - OIDC.
- `ISSUER_URL` - Issuer URL.
- `AUTHORIZATION_URL` - Authorization URL.
- `TOKEN_URL` - Token URL.
- `USERINFO_URL` - User info URL.
- `CLIENT_ID` - Client ID.
- `CLIENT_SECRET` - Client secret.
- `CALLBACK_URL` - Callback URL. **__[Example]__**: `https://localhost:8888/${frontend-sub-path}/callback`.
- `OIDC_AVATAR_URL` - Endpoint template for fetching user/avatar info. **__[GitHub Example]__**: `https://api.github.com/users/${USERNAME}`.
   1. `${USERNAME}` - This template variable will be replaced with a username. **__[Example]__**: `https://API/userByName/${USERNAME}`.
   2. `${EMAIL}` - This template variable will be replaced with an email. **__[Example]__**: `https://API/userByEmail/${EMAIL}`.
   3. `${ID}` - This template variable will be replaced with a user ID. **__[Example]__**: `https://API/userByID/${ID}`.
- `OIDC_AVATAR_KEY` - JSON path for avatar URL. **__[GitHub Example]__**: `avatar_url`.

#### OAuth GITHUB

- `STRATEGY` - GITHUB.
- `GITHUB_APP_ID` - GitHub App ID.
- `GITHUB_APP_SECRET` - GitHub App Secret.
- `STRATEGY_CALLBACK_URL` - GitHub Callback URL. **__[Example]__**: `https://localhost:8888/${frontend-sub-path}/callback`.
- `STRATEGY_BASE_URL` - https://github.com.

#### OAuth GITLAB

- `STRATEGY` - GITLAB.
- `GITLAB_APP_ID` - GitLab App ID.
- `GITLAB_APP_SECRET` - GitLab App Secret.
- `STRATEGY_CALLBACK_URL` - GitLab Callback URL. **__[Example]__**: `https://localhost:8888/${frontend-sub-path}/callback`.
- `STRATEGY_BASE_URL` - https://gitlab.com.


Notes:
- You can create `.env` file in backend root with all necessary values.
- See documentation about configuring authentication at this link: https://github.com/ibagroup-eu/Visual-Flow-deploy/blob/main/OAUTH.md

##### Frontend settings:

N/A

## Start locally for development

##### Frontend

1. Open frontend project folder `cd frontend`.
2. Setup dependencies: `npm install` / `npm ci`.
3. Run the app: `npm start`. It will be watching sources for change and rebuild.

##### Backend (Node proxy)

1. Open backend project folder `cd backend`.
2. Setup dependencies: `npm install` / `npm ci`.
3. Set necessary environment variables (at least `MOCK_SERVER` and `API_SERVER`, `NODE_ENV=development`),
f.e. in `backend/.env` file
4. Run server in development mode: `npm start`. It will be watching sources for change and rebuild.

##### JSON-Server

1. Open backend project folder `cd json-server`.
2. Setup dependencies: `npm install` / `npm ci`.
3. Run server: `npm start`. It will be watching sources for change and rebuild.

## Start for production

##### Frontend

1. Open frontend project folder `cd frontend`.
2. Setup dependencies: `npm install` / `npm ci`.
3. Build the app: `npm run build`.


##### Backend

1. Open backend project folder `cd backend`.
2. Setup dependencies: `npm install` / `npm ci`.
3. Set necessary environment variables (at least `API_SERVER`, `NODE_ENV=production`),
4. Run server in production mode: `npm run start:prod`.
