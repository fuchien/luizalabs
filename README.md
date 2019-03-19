# Luizalabs backend test

> Test to read game log file, manipulate the file data and create API to show all game data

## Developing

First, you need install [**docker**](#Docker) or you can run only with [**node**](#Node)

_Clone the repository_

```
git clone https://github.com/fuchien/luizalabs.git
```

## Docker

_Run docker-compose to start the server and database_

```
docker-compose up --build
```

---

## Node

```
npm install
```

_Run postgres database_

```
docker run --name luizalabs -p 5432:5432 -e POSTGRES_DBNAME=luizalabs -e POSTGRES_USER=luizalabs -e POSTGRES_PASS=luizalabs -d -t kartoza/postgis
```

_Create table by migration_

---

### For both, you need create table running **db:migrate**

```
// With docker
docker exec luizalabs npx sequelize db:migrate

// With node
npx sequelize db:migrate
```

_Open your favourite browser, and enter_

```
http://localhost:3001
```

**You need select file button, and put the file locate in**

```
/backend_test/src/public/games.log
```

## Description and solution

The backend will receive the file, save file in **uploads** folder, get the file data and manipulate each line to create an **Game** object, then save all games objects in database. After, you can get **games** or **game** data by **API**.

---

## Testing

To test the application, only need to run script

```
npm run test
```

You wil have each test in **terminal** and **coverage** for each file

---

## Endpoint list:

- [**GET** /logs](#getAllLogs)
- [**GET** /logs/:id](#getLogById)

---

## getAllLogs

Returns all games log object

**Input:** _path parameter_

```
/logs
```

| params | required | type   |
| ------ | -------- | ------ |
| `logs` | true     | string |

**Output:**

```
[
  {
    game_id: 1,
    total_kills: 0,
    kills: {},
    players: []
  },
  ...
]
```

---

## getLogById

Returns the game log object

**Input:** _path parameter_

```
/logs/:id
```

| params | required | type   |
| ------ | -------- | ------ |
| `logs` | true     | string |
| `:id`  | true     | string |

**Output:**

```
{
  game_id: 1,
  total_kills: 0,
  kills: {},
  players: []
}
```
