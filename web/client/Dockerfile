## This file should be run from the parent directory with the following command:
## Since it uses commont type libraries
#cd ../
#docker build -f client/DockerFile .
FROM node:16 as builder

# Working DIR
WORKDIR /usr/src/app
COPY --chown=node:node ./client /usr/src/app
COPY --chown=node:node ./common /usr/src/common
RUN npm ci && npm run build

FROM node:16 AS production
WORKDIR /usr/src/app
COPY --chown=node:node --from=builder /usr/src/app/build ./build
COPY --chown=node:node --from=builder /usr/src/app/package.json ./
RUN npm ci --only=production
EXPOSE 3000
# Serve the prod build
CMD ["npm", "start"]
