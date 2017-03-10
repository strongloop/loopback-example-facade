FROM node:6.9

# Create app directory
RUN mkdir -p /usr/src/customer-service
WORKDIR /usr/src/customer-service

# Install app dependencies
COPY package.json /usr/src/customer-service
RUN npm install

# Bundle app source
COPY . /usr/src/customer-service

EXPOSE 3000
CMD [ "node", "." ]