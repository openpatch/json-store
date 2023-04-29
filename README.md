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

## Protocol

### POST

Example endpoint URL

```
https://json.openpatch.org/api/v2/post/
```

#### Binary payload

Example of `binary` payload

```
1234567890
```

#### Response

```
{
  "id": "5633286537740288",
  "data": "https://json.openpatch.org/api/v2/5633286537740288"
}
```

### GET

Example endpoint URL

```
https://json.openpatch.org/api/v2/5633286537740288
```

#### Response

Example of binary response. If the id is found it will return the data. Otherwise 404.

```
1234567890
```
