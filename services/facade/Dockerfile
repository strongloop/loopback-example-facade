FROM node:6.9

# Create app directory
RUN mkdir -p /usr/src/facade
WORKDIR /usr/src/facade

ENV DEBUG loopback:connector:swagger

# Install app dependencies
COPY package.json /usr/src/facade
RUN npm install

# Bundle app source
COPY . /usr/src/facade

EXPOSE 3000

HEALTHCHECK --interval=1m --timeout=3s CMD curl --fail http://0.0.0.0:80/vitals/docker || exit 1  

CMD [ "node", "." ]
