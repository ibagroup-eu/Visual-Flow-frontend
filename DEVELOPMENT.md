# Development Setup

In order to run the application you need to provide next environment variables.

##### Backend settings: 

- `API_SERVER` - https://${backend-url}/${backend-sub-path}
- `MOCK_SERVER` - http://localhost:3010
- `SESSION_SECRET` - use your
- `BASE_URL` - /${frontend-sub-path}/
#### Use ENV variables below for STRATEGY=GITHUB
- `STRATEGY` - GITHUB
- `GITHUB_APP_ID` - use your GitHub App ID
- `GITHUB_APP_SECRET` - use your GitHub App Secret
- `STRATEGY_CALLBACK_URL` - https://localhost:8888/${frontend-sub-path}/callback
- `GITHUB_STRATEGY_BASE_URL` - https://github.com
#### Use ENV variables below for STRATEGY=GITLAB
- `STRATEGY` - GITLAB
- `GITLAB_APP_ID` - use your GitLab App ID
- `GITLAB_APP_SECRET` - use your GitLab App Secret
- `STRATEGY_CALLBACK_URL` - https://localhost:8888/${frontend-sub-path}/callback
- `STRATEGY_BASE_URL` - https://gitlab.com


Notes:
- You can create `.env` file in backend root with all necessary values.
- See documentation about configuring authentication at this link: https://github.com/ibagomel/Visual-Flow-deploy/blob/main/OAUTH.md

##### Frontend settings:

N/A

## Start locally for development

##### Frontend

1. Open frontend project folder `cd frontend`.
2. Setup dependencies: `npm install`.
3. Run UI application: `npm start`. It will be watching sources for change and rebuild.

##### Backend

1. Open backend project folder `cd backend`.
2. Setup dependencies: `npm install`.
3. Set necessary environment variables (at least `MOCK_SERVER` and `API_SERVER`),
f.e. in `backend/.env` file
4. Run server in development mode: `npm start`. It will be watching sources for change and rebuild.

##### JSON-server

1. Open backend project folder `cd json-server`.
2. Setup dependencies: `npm install`.
3. Run server: `npm start`. It will be watching sources for change and rebuild.

## Start for production

##### Frontend

1. Open frontend project folder `cd frontend`.
2. Setup dependencies: `npm install`.
3. Build UI application: `npm run build`.


##### Backend

1. Open backend project folder `cd backend`.
2. Setup dependencies: `npm install`.
3. Set necessary environment variables (at least `API_SERVER`),
4. Run server in production mode: `npm run start:prod`.
