# Wake On LAN Frontend

## Prerequisites

Have the following intalled on your system:
- Node
- NPM

Then install vite:
```
npm install vite
```

## Run the app
To run the app in development:
```
npm run dev
```

## Building for production
To build static files for the app:
```
npm run build
```

which will build static files into the `dist` directory.

## Docker
A docker image for a static webserver can be built using:
```
docker -t wolfrontend .
```

Then it can be run using:
```
docker run -d --rm -p 8080:80 --name wolfrontend wolfrontend
```

or using docker compose while in the root dir:
```
docker compose up -d
```

