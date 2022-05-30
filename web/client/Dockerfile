## This file should be run from the parent directory with the following command:
## Since it uses commont type libraries
#cd ../
#docker build -f client/DockerFile .
FROM node:16 as builder

# Working DIR
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ./client/package.json ./
COPY ./client/package-lock.json ./
COPY  ./client ./
COPY ./common ../common
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

EXPOSE 3000
# Serve the prod build
CMD ["npm", "start"]
