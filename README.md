# OpenPatch JSON Store

The server that stores all shareable workspaces from [Online-IDE NRW](https://nrw.onlineide.openpatch.org) on a custom server (in our case on Hetzner Cloud).

### Commands

```
yarn dev
yarn start
yarn build
yarn fix
yarn test
```

### Production

```
yarn build
yarn global add pm2
pm2 start ecosystem.config.js --env production
```

#### Upload limit

The upload limit is set to 100MB. This should probably be handled by an external proxy.

## Protocol

### POST (Create new)

Example endpoint URL

```
https://json.openpatch.org/api/v2/post/
```

#### JSON payload

Example of JSON payload

```json
{
  "data": "1234567890",
  "password": "mySecretPassword"
}
```

Note: The `password` field is optional. If provided, the stored data will be password-protected and can only be updated using the POST endpoint with the ID.

#### Response

```json
{
  "id": "5633286537740288",
  "data": "https://json.openpatch.org/api/v2/5633286537740288"
}
```

### POST (Update existing with password)

Example endpoint URL

```
https://json.openpatch.org/api/v2/post/5633286537740288
```

This endpoint allows you to update an existing JSON file by providing its ID. The file must have been created with a password, and you must provide the correct password to update it.

#### JSON payload

```json
{
  "data": "new data",
  "password": "mySecretPassword"
}
```

Note: The `password` field is required and must match the password stored in the existing file.

#### Response

Success (200):

```json
{
  "id": "5633286537740288",
  "data": "https://json.openpatch.org/api/v2/5633286537740288"
}
```

Error responses:

- 401 Unauthorized: Password is missing or incorrect
- 403 Forbidden: File is not password-protected
- 404 Not Found: File with the given ID does not exist
- 500 Internal Server Error: Could not update the data

### GET

Example endpoint URL

```
https://json.openpatch.org/api/v2/5633286537740288
```

#### Response

Example of JSON response. If the id is found it will return the data. Otherwise 404.

For files without password:

```json
{
  "data": "1234567890"
}
```

For files with password:

```json
{
  "data": "1234567890",
  "password": true
}
```

Note: The `password` field is replaced with a boolean value (`true`) indicating the file is password-protected. The actual password value is never included in GET responses for security reasons.
