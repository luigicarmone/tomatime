import React, { useEffect, useState } from "react";
import "./loginstyle.css";
import Formlog from "./Rettangolo 2.png";
import Logo from "./Raggruppa 19.png";
import Background from "./Sfondo-Tomatime-ed-2.png";
import Break from "./Raggruppa 22.png";
import Login from "./Login.png";
import EyeIcon from "./EyeIcon.png";
import EyeIconHide from "./EyeIconHide.png";
import CroceRossa from "./croceRossa.png"
import { login, getTasks, getStep } from "../../api/client";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = ({ allTasks, setAllTasks, setUserId, setStep }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alertError, setAlertError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disableForm, setDisableForm] = useState(true);
  const user = { email: email, password: password };

  const navigate = useNavigate();

  const handleCloseError = () => { // PER CHIUDERE IL MESSAGGIO DI ERRORE
    setAlertError(false);
  };

  const handleShowPassword = () => { // PER MOSTRARE LA PASSWORD 
    setShowPassword(!showPassword);
    setPasswordVisible(!passwordVisible);
  };

  // CONTROLLI
  const regex = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,}$");
  const isEmailValid = regex.test(email);
  const isPasswordValid = password.length >= 6;

  useEffect(() => {
    setDisableForm(!(isEmailValid && isPasswordValid));
  }, [isEmailValid, isPasswordValid]);

  const passwordInputClass = passwordVisible ? "passwordVisible" : "";

  return (

    <div className="backgroundLogin" style={{ backgroundImage: `url(${Background})` }}>
      <div className="break puff-in-center">
        <img src={Break} alt="break" />
      </div>
      <div className="title slide-in-left">
        <img src={Logo} alt="logo" />
      </div>
      <div className="contlog ">
        <img src={Formlog} alt="form" />
        <form className="form text-focus-in">
          <label htmlFor="email">
            <input className={`${!isEmailValid ? "invalid" : ""} emailLogin`} type="email" name="email" placeholder="Email" value={email} minLength={8} maxLength={25} required onChange={(e) => { setEmail(e.target.value) }} />
            <span error={"Use a valid email!"} id="errorEmail" />
          </label>
          <br />
          <label htmlFor="password">
            <input className={`${!isPasswordValid ? "invalid" : ""} ${passwordInputClass} passwordLogin`} type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={password} minLength={2} maxLength={25} required onChange={(e) => { setPassword(e.target.value) }} />
            <span error={"Use a valid password!"} id="errorPassword" />
            <img
              src={passwordVisible ? EyeIconHide : EyeIcon}
              alt="eye-icon"
              className="eyeIcon"
              onClick={() => {
                handleShowPassword();
              }}
            />
          </label>
          <br />
          <input type="submit" value="LOGIN" onClick={async (e) => {
            e.preventDefault();
            setEmail("");
            setPassword("");
            const result = await login(user);
            if (result.email && result.password) {
              setUserId(result.userID);
              const tasks = await getTasks(result.userID);
              setAllTasks(tasks);
              const stepLogin = await getStep(result.userID);
              console.log(stepLogin);
              setStep(stepLogin);
              console.log("START TIME: " + stepLogin.startTime)
              navigate("/app");
            } else {
              setAlertError(true);
            }
          }
          } disabled={disableForm} />
        </form>
        <div className="register text-focus-in">
          Not registered yet? <Link to="/signup" className="colorRegister">Register now</Link>
        </div>
      </div>
      <div className="login text-focus-in">
        <img src={Login} alt="login" />
      </div>


      <div className={alertError ? "alertErrorLogin" : "alertErrorLogin2"}>
        <div className="alertErrorContent">
          <img src={CroceRossa} alt="croce rossa" className="redCross" />
          <span>WRONG CREDENTIALS</span>
          <button name="close" onClick={handleCloseError}>Close</button>
        </div>
      </div>

    </div>
  );
}

export default LoginPage;