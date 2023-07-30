'use strict';
const bcrypt = require("bcrypt");
const url = require("url");
const {
  addUser,
  getUser,
  addTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getTomato,
  addTomato,
  breakTomato,
  getTomaInfo
} = require("../api");

const { getBodyParams, getQueryParams } = require("../utils");


const router = require('find-my-way')({
  defaultRoute: (request, response) => {
    response.statusCode = 404
    response.end("Metodo inesistente")
  }
}
);


function setHeader(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Request-Method', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  response.setHeader('Access-Control-Allow-Headers', '*');

}


function registerRoutes() {

  /* Registra un nuovo utente */
  router.on('POST', '/signup', async (request, response) => {
    setHeader(response);
    response.statusCode = 201;
    const body = await getBodyParams(request);
    const { name, email, password, cpass } = body;

    if (!email || !password || !cpass || !name) {
      response.statusCode = 401;
      response.end("I campi non sono tutti compilati");
    }

    else {
      if (password.length > 5) {
        if (password === cpass) {
          const hash = await bcrypt.hash(password, 10);
          const user = await getUser(email);

          if (user) {
            response.statusCode = 401;
            return response.end(JSON.stringify({ emailExist: true }));
          }

          const newUser = await addUser(name, email, hash);
          JSON.stringify({ email: newUser.email, emailExist: false }, null, 4);
        }

        else {
          response.statusCode = 401;
          response.end("Le password non corrispondono");
        }

      } else {
        response.statusCode = 401;
        response.end("La password è minore di 6 caratteri!");
      }
    }

  });


  /* Login di un utente */
  router.on('POST', '/login', async (request, response) => {
    setHeader(response);
    response.statusCode = 201;
    const body = await getBodyParams(request);
    const { email, password } = body;

    if (!email || !password) {
      response.statusCode = 401;
      response.end("I campi non sono tutti compilati");
    }

    else {
      const user = await getUser(email);

      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          console.log("Autenticato");
          return response.end(
            JSON.stringify({ email: true, password: true, userID: user._id })
          );
        }
        response.statusCode = 401;
        return response.end(JSON.stringify({ email: true, password: false }));
      }

      response.statusCode = 401;
      return response.end(JSON.stringify({ email: false, password: false }));
    }
  });


  /* Aggiunta utente */
  router.on('POST', '/users', async (request, response) => {
    setHeader(response);

    /* Recupero i dati del nuovo utente dal body della richiesta */
    const newUser = await getBodyParams(request);
    /* Fine */

    /* Aggiungo il nuovo utente chiamato la funzione addUser */
    const user = await addUser(newUser);
    /* Fine */

    if (user === null) {
      response.statusCode = 500;
      response.end("Errore nell'inserimento dell'utente");
      return;
    }

    response.end(JSON.stringify(user));
  });


  /* Recupero dei task */
  router.on("GET", "/tasks", async (request, response) => {
    setHeader(response);
    response.statusCode = 201;

    const userId = getQueryParams(request)._id;
    const Tasks = await getAllTasks(userId);
    const userTasks = Tasks.filter((task) => task.userId === userId);
    return response.end(JSON.stringify(userTasks));
  });


  /* Aggiunta nuovo task */
  router.on("POST", "/tasks", async (request, response) => {
    setHeader(response);
    response.statusCode = 201;

    const userId = getQueryParams(request)._id;
    const body = await getBodyParams(request);
    const { title, description } = body;

    if (!title) {
      response.statusCode = 401;
      response.end("Il titolo Ã¨ obbligatorio");
    }

    else {
      console.log("sono qui");
      const newTask = await addTask(userId, title, description);

      if (newTask === null) {
        response.statusCode = 500;
        response.end("Errore nell'inserimento della task");
        return;
      }

      response.end(JSON.stringify({ id: newTask._id }, null, 4));
    }
  });


  /* Modifica task */
  router.on("PUT", "/tasks", async (request, response) => {
    setHeader(response);
    response.statusCode = 204;
    const taskId = getQueryParams(request)._id;
    const body = await getBodyParams(request);

    if (!body) {
      response.statusCode = 401;
      response.end("Nessun campo da aggiornare");
    }

    else {
      const check = await updateTask(taskId, body);

      if (check === null) {
        response.statusCode = 500;
        response.end("Errore nell'aggiornamento della task");
        return;
      }

      response.end();
    }
  });

  router.on("OPTIONS", "/tasks", async (request, response) => {
    setHeader(response);
    response.statusCode = 204;
    response.end();
  });


  /* Eliminazione task */
  router.on("DELETE", "/tasks", async (request, response) => {
    setHeader(response);
    response.statusCode = 200;
    const taskID = getQueryParams(request)._id;
    const check = await deleteTask(taskID)

    if (check === null) {
      response.statusCode = 500;
      response.end("Errore nell'eliminazione della task");
      return;
    }

    response.end(JSON.stringify(check, null, 4));
  });


  /* Reperimento pomodoro */
  router.on("GET", "/tomato", async (request, response) => {
    setHeader(response);
    response.statusCode = 200;
    const userId = getQueryParams(request)._id;

    const tomato = await getTomato(userId);
    if (tomato) {
      return response.end(JSON.stringify(tomato, null, 4));
    }
    response.statusCode = 404;
    response.end(JSON.stringify({ tomatoNotExist: true }));
  });


  /* Avvio pomodoro */
  router.on("POST", "/tomato", async (request, response) => {

    setHeader(response);
    response.statusCode = 200;
    const userId = getQueryParams(request)._id;
    const tomato = await addTomato(userId);
    return response.end(JSON.stringify(tomato, null, 4));
  });


  /* Rottura Pomodoro */
  router.on("PUT", "/tomato", async (request, response) => {
    setHeader(response);
    response.statusCode = 200;
    const userId = getQueryParams(request)._id;
    const brokenTomato = await breakTomato(userId);
    return response.end(JSON.stringify(brokenTomato, null, 4));
  });

  
  router.on("OPTIONS", "/tomato", async (request, response) => {
    setHeader(response);
    response.statusCode = 204;
    response.end();
  });


  router.on("GET", "/info", async (request, response) => {
    setHeader(response);
    response.statusCode = 200;
    const userId = getQueryParams(request)._id;
    const info = await getTomaInfo(userId);
    
    if (info) {
      return response.end(JSON.stringify(info, null, 4));
    }
    
    response.end(JSON.stringify({tomaCount: 0, taskCount: 0, brokenTomaCount: 0}));
  });

  router.on("OPTIONS", "/info", async (request, response) => {
    setHeader(response);
    response.statusCode = 204;
    response.end();
  });

  return router;
}


function lookup(request, response) {
  router.lookup(request, response);
}

module.exports = {
  registerRoutes,
  lookup
};