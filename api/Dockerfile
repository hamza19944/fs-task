FROM node:16
WORKDIR /src
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8008
CMD [ "npm", "run", "dev" ]