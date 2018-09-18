# TABLE RESERVATION API

__NOTICE! Before proceed plese make sure you have created .env file__

Images used: 
- [Nodejs 8.12-alpine][1]
- [Postgres 10.5-alpine][2]

_for simpisity used default username tablename (see in postgres link)_

**RUN STACK**
```
docker-compose up
```
_for cases when new config didn't applied use --force-recreate_

**RUN KNEX CLI COMMANDS INSIDE STACK**
```
make knex COMMAND='migrate:currentVersion'
```

**START INSTRUCTIONS**

```
make knex COMMAND='migrate:latest'
```
```
make knex COMMAND='seed:run'
```

[1]: https://hub.docker.com/_/node/
[2]: https://hub.docker.com/_/postgres/