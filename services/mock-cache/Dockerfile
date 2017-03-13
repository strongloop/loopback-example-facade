FROM node:6.9

# Create app directory
RUN mkdir -p /usr/src/mock-cache
WORKDIR /usr/src/mock-cache

# Install app dependencies
COPY package.json /usr/src/mock-cache
RUN npm install

# Bundle app source
COPY . /usr/src/mock-cache

EXPOSE 3000
CMD [ "node", "." ]