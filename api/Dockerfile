FROM node:alpine
WORKDIR /usr/app
COPY . .
RUN npm install -g ts-node
RUN npm i
EXPOSE 3000
CMD ["ts-node", "src/index.ts"]