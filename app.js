const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const databasePath = path.join(__dirname, "todoApplication.db");
let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const isPriorityAndStatus = (requestQuery) => {
  return;
  requestQuery.priority !== undefined && requestQuery.status !== undefined;
};

const isPriority = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const isStatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const isSearch_q = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};

app.get("/todos/", async (request, response) => {
  let getTodo = null;
  const { priority, status, search_q } = request.query;

  switch (true) {
    case isPriorityAndStatus(request.query):
      getTodo = `
            SELECT *
            FROM todo
            WHERE priority = '${priority}' AND status = '${status}'`;
      break;

    case isStatus(request.query):
      getTodo = `
            SELECT * 
            FROM todo
            WHERE status = '${status}'`;
      break;

    case isPriority(request.query):
      getTodo = `
            SELECT * 
            FROM todo
            WHERE priority = '${priority}'`;
      break;

    case isSearch_q(request.query):
      getTodo = `
            SELECT *
            FROM todo
            WHERE todo LIKE '%${search_q}%'`;
  }

  const listOfTodo = await database.all(getTodo);

  response.send(listOfTodo);
  console.log(status);
});
