const { MongoClient, ObjectId, BSON } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

const DB_NAME = 'tomatime';

const USER_COLLECTION = 'users';
const TASK_COLLECTION = 'tasks';
const CYCLE_COLLECTION = 'tomasteps';
const TOMA_COLLECTION = 'tomatoes';

async function getAllUsers() {
  try {
    /* Connessione al db */
    await client.connect();

    /* Selezione del db tomatime */
    const database = client.db(DB_NAME);

    /* Seleziono la collection users */
    const collection = database.collection(USER_COLLECTION);

    /* Ritorno la lista di utenti al metodo */
    return await collection.find().toArray();
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}

async function getAllTasks() {
  try {
    /* Connessione al db */
    await client.connect();

    /* Selezione del db tomatime */
    const database = client.db(DB_NAME);

    /* Seleziono la collection users */
    const collection = database.collection(TASK_COLLECTION);

    /* Ritorno la lista di utenti al metodo */
    return await collection.find().toArray();
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}


async function getUser(Email) {
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const userCollection = database.collection(USER_COLLECTION);

    const query = { email: Email };

    return await userCollection.findOne(query);
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}


async function addUser(name, email, password) {
  try {
    /* Connessione al db */
    await client.connect();

    /* Selezione del db tomatime */
    const database = client.db(DB_NAME);

    /* Seleziono la collection users */
    const userCollection = database.collection(USER_COLLECTION);

    /* Uso il comando insertOne per inserire il singolo user */
    const user = await userCollection.insertOne({ name, email, password });

    /* Recupero l'id dell'utente appena inserito */
    const userId = user.insertedId;

    /* Uso l'id del nuovo utente per recuperarlo e tornarlo alla chiamata */
    return await userCollection.findOne({ _id: new ObjectId(userId) });
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}


async function getTasks(userId) {
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const taskCollection = database.collection(TASK_COLLECTION);

    // const query = { userId: new ObjectId(userId) };
    // console.log(query);
    return await taskCollection.find({ userId: new ObjectId("64493e0d59fbf9d4a7c16946") });
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}



async function addTask(userId, title, description) {
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const taskCollection = database.collection(TASK_COLLECTION);

    const task = await taskCollection.insertOne({
      userId,
      title,
      description,
      status: "todo"
    });
    console.log(task);
    const taskId = task.insertedId;

    return await taskCollection.findOne({ _id: new ObjectId(taskId) });
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}


async function updateTask(_id, { userId, title, description, status }) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const taskCollection = db.collection(TASK_COLLECTION);

    const query = { _id: new ObjectId(_id) };
    const update = { $set: { userId, title, description, status } };

    return await taskCollection.updateOne(query, update);
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}


async function deleteTask(taskID) {
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const taskCollection = database.collection(TASK_COLLECTION);
    return await taskCollection.deleteOne({ _id: new ObjectId(taskID) });
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}


async function getTomato(userId) {
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const tomaCollection = database.collection(TOMA_COLLECTION);
    const cycleCollection = database.collection(CYCLE_COLLECTION);

    const tomato = await tomaCollection.find({ userId }).sort({ startTime: -1 }).toArray();
    let nextStepInfo;
    let firstStep;

    if (tomato.length === 0) {
      firstStep = await cycleCollection.find().sort({ step: 1 }).toArray();
    }

    else {
      nextStepInfo = await cycleCollection.findOne({ step: (tomato[0].step < 6 ? (tomato[0].step + 1) : 1) });
    }

    if (tomato.length !== 0) {
      return { ...tomato[0], nextStep: nextStepInfo.step, nextStepDuration: nextStepInfo.duration, nextStepType: nextStepInfo.stepType }
    }

    else {
      return { ...tomato[0], nextStep: firstStep[0].step, nextStepDuration: firstStep[0].duration, nextStepType: firstStep[0].stepType }
    }
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}


async function addTomato(userId) {
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const tomaCollection = database.collection(TOMA_COLLECTION);
    const lastTomato = await getTomato(userId);
    await client.close();
    await client.connect();
    const cycleCollection = database.collection(CYCLE_COLLECTION);
    const firstStep = await cycleCollection.find().sort({ step: 1 }).toArray();
    if (lastTomato.nextStep !== null) {
      const newTomato = await tomaCollection.insertOne({
        userId,
        step: lastTomato.nextStep,
        duration: lastTomato.nextStepDuration,
        stepType: lastTomato.nextStepType,
        startTime: new Date,
        brokenDate: null
      });
      const addedTomato = await tomaCollection.findOne({ _id: new ObjectId(newTomato.insertedId) });
      return addedTomato;
    }

    else {
      const newTomato = await tomaCollection.insertOne({
        userId,
        step: firstStep[0].step,
        duration: firstStep[0].duration,
        stepType: firstStep[0].stepType,
        startTime: new Date,
        brokenDate: null
      });
      const addedTomato = await tomaCollection.findOne({ _id: new ObjectId(newTomato.insertedId) });
      return addedTomato;
    }
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}

async function breakTomato(userId) {
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const tomaCollection = database.collection(TOMA_COLLECTION);
    const lastTomato = await getTomato(userId);
    await client.close();

    await client.connect();
    const query = { _id: new ObjectId(lastTomato._id) }
    const update = { $set: { brokenDate: new Date } }
    const updatedTomato = await tomaCollection.updateOne(query, update)
    return await getTomato(userId);
  }

  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}


async function getTomaInfo(userId) {
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const taskCollection = database.collection(TASK_COLLECTION);
    const taskCount = await taskCollection.countDocuments({ userId, status: "done" })
    await client.close();

    const lastTomato = await getTomato(userId);

    await client.connect();
    const tomaCollection = database.collection(TOMA_COLLECTION);

    const brokenCount = await tomaCollection.countDocuments({ userId, brokenDate: {$ne:null} })
    const timeout = Date.now() - lastTomato.startTime;
    console.log(Date.now());
    console.log(lastTomato.startTime);
    console.log(timeout);

    if (timeout >= lastTomato.duration) {
      if (lastTomato.brokenDate) {
        const tomaCount = await tomaCollection.countDocuments({ userId, brokenDate: null});
        return {taskCount, tomaCount, brokenCount};
      }
      
      else {
        const tomaCount = await tomaCollection.countDocuments({ userId, brokenDate: null});
        return {taskCount, tomaCount: tomaCount-1, brokenCount};
      }
    }
    
    else {
      const tomaCount = await tomaCollection.countDocuments({ userId, brokenDate: null});
      return {taskCount, tomaCount, brokenCount};
    }
  }
  
  catch (e) {
    console.error(e);
    return null;
  }

  finally {
    await client.close();
  }
}


module.exports = {
  addUser,
  getUser,
  getAllUsers,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getTomato,
  addTomato,
  breakTomato,
  getTomaInfo
}