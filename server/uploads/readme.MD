# ![Node/Nest/Mongo Workchat]

> ### NestJS codebase containing real world examples (CRUD, auth, advanced patterns, etc).

---

## Description

Backend on NestJs using Prisma projects

## About

The project uses GRASP and SOLID patterns. There is an emphasis on the division of responsibility, layered architecture

## Note

The database for the project is used in a docker container, so you will need tools to work with the docker

The project use base on [Xây dựng ứng dụng chat Realtime với Nest.js](https://blog.vietnamlab.vn/xay-dung-ung-dung-chat-realtime-voi-nestjs/)

## Download

```bash
git clone https://github.com/longnguyen-cyber/workchat.git
cd workchat
```

## Install dependencies

```bash
$ yarn install
```

## Start Postgres DB on docker container

```bash
$ docker-compose up -d
$ docker build -t workchat .

$ docker stop workchat (name:workchat)
$ docker rm workchat (name:workchat)
$ docker rmi workchat (name:workchat)
```

## Running the app

```bash
# development
$ yarn start:dev

# prod mode
$ yarn run start:prod

```
