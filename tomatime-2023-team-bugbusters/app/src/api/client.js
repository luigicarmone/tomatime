import axios from "axios";
// import React, { useState } from "react";
// import AppToma from "../components/AppToma";

// const client = axios.create({
//   baseURL: "http://localhost:3001", // o l'endpoint del vostro backend
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + localStorage.getItem("token"),
//   },
// });

// export default client;

const signup = async (user) => {
  const newUser = JSON.stringify(user);

  try {
    const response = await axios.post("http://localhost:3000/signup", newUser);
    return response.data;
  }

  catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.log("Errore:", err.message);
    }
  }
};

const login = async (credentials) => {
  const loginData = JSON.stringify(credentials);

  try {
    const response = await axios.post("http://localhost:3000/login", loginData);

    return response.data;
  }

  catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.log("Errore:", err.message);
    }
  }
};


const getTasks = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3000/tasks?_id=${userId}`);
    //console.log(response.data);
    return response.data;
  }

  catch (err) {
    if (err.response) {
      return err.response.data;
      // The client was given an error response (5xx, 4xx)
    }

    else {
      // Anything else
      console.log("Errore", err.message);
    }
  }
};

const AddTasks = async (userId, newTask) => {
  const newTaskJSON = JSON.stringify(newTask);

  try {
    const response = await axios.post(`http://localhost:3000/tasks?_id=${userId}`, newTaskJSON);
    return response.data;
  }

  catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.log("Errore:", err.message);
    }
  }
};

const UpdateTask = async (taskId, newTask) => {
  console.log("taskid: ", taskId);
  const newTaskJSON = JSON.stringify(newTask);
  try {
    const response = await axios.put(`http://localhost:3000/tasks?_id=${taskId}`, newTaskJSON);
    return response.data;
  }

  catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.log("Errore:", err.message);
    }
  }
};

const DeleteTask = async (taskId, newTask) => {
  const newTaskJSON = JSON.stringify(newTask);
  try {
    const response = await axios.delete(`http://localhost:3000/tasks?_id=${taskId}`, newTaskJSON);
    return response.data;
  }

  catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.log("Errore:", err.message);
    }
  }
};

const getStep = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3000/tomato?_id=${userId}`);
    return response.data;
  }

  catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.log("Errore:", err.message);
    }
  }
};

const postStep = async (userId) => {
  try {
    const response = await axios.post(`http://localhost:3000/tomato?_id=${userId}`);
    return response.data;
  }

  catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.log("Errore:", err.message);
    }
  }
};

const getInfo = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3000/info?_id=${userId}`);
    return response.data;
  }

  catch (err) {
    if (err.response) {
      return err.response.data;
    }

    else {
      console.log("Errore", err.message);
    }
  }
};

const updateStep = async (userId) => {
  try {
    const response = await axios.put(`http://localhost:3000/tomato?_id=${userId}`);
    return response.data;
  }

  catch (err) {
    if (err.response) {
      return err.response.data;
    }

    else {
      console.log("Errore", err.message);
    }
  }
};

export { signup, login, getTasks, AddTasks, UpdateTask, DeleteTask, updateStep, getStep, getInfo, postStep };