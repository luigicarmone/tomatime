import React, { useState } from "react";
//import { Button, Container } from "react-bootstrap";
import LoginPage from "./components/LoginPage/login";
import AppToma from "./components/AppToma";
import RegisterPage from "./components/RegisterPage/register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const App = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [step, setStep] = useState([]);
  const [userId, setUserId] = useState("");

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage allTasks={allTasks} setAllTasks={setAllTasks} setUserId={setUserId} setStep={setStep} />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route
            path="/app" element={<AppToma allTasks={allTasks} setAllTasks={setAllTasks} userId={userId} step={step} setStep={setStep} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
