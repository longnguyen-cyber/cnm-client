FROM node:lts-hydrogen
WORKDIR /usr/src/app
ENV APP_PORT=5000
ENV DATABASE_URL=mongodb+srv://kuga:kuga@workchat.t6kzqkr.mongodb.net/workchat
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 5000
CMD [ "yarn", "start" ]