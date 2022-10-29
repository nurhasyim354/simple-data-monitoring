FROM node:16-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Expose public port and run npm command
EXPOSE 8001 8002
CMD ["npm", "start"]