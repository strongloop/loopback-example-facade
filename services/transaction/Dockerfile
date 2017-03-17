FROM node:7

# Create app directory
RUN mkdir -p /usr/src/transaction-service
WORKDIR /usr/src/transaction-service

# Install app dependencies
COPY package.json /usr/src/transaction-service
RUN npm install

# Bundle app source
COPY . /usr/src/transaction-service

EXPOSE 3000

HEALTHCHECK --interval=1m --timeout=3s CMD curl --fail http://localhost/vitals/docker || exit 1

CMD ["node", "."]
