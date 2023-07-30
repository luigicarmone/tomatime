import React, { useEffect, useState } from "react";
import "./registerstyle.css";
import EyeIcon from "./EyeIcon.png";
import EyeIconHide from "./EyeIconHide.png";
import { signup } from "../../api/client";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [newsletter, setNewsletter] = useState(false); // Aggiunto lo stato per la checkbox
  const [disableForm, setDisableForm] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setCpass] = useState("");
  const user = { name: name, email: email, password: password, cpass: cpass };

  const regex = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,}$");
  const isEmailValid = regex.test(email);
  const isNameValid = name.length >= 1;
  const isPasswordValid = password.length >= 6;
  const isConfirmPasswordValid = cpass === password;

  useEffect(() => {
    setDisableForm(
      !(
        isNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid
      )
    );
  }, [isNameValid, isEmailValid, isPasswordValid, isConfirmPasswordValid]);


  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
    setPasswordVisible(!passwordVisible);
  };

  const handleShowConfirmPassword = (e) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleNewsletterChange = (e) => {
    setNewsletter(e.target.checked);
  }; // Funzione per gestire il cambiamento di stato della checkbox

  const passwordInputClass = passwordVisible ? "passwordVisibleRegister" : "";
  const confirmPasswordInputClass = confirmPasswordVisible ? "confirmPasswordVisibleRegister" : "";

  return (
    <div className="backgroundRegister">
      <div className="titleRegister slide-in-left" />
      <div className="breakRegister puff-in-center" />
      <div className="contlogRegister">
        <div className="signIn text-focus-in" />
        <form className="formRegister text-focus-in">
          <label>
            {/* NAME */}
            <input className={`${!isNameValid ? "invalid" : ""}`} type="text" name="name" placeholder="Name" minLength={1} maxLength={256} value={name} onChange={(e) => { setName(e.target.value) }} />
            <span error={"Set a name!"} id="nameError"></span>
          </label>
          <br />
          <label>
            {/* EMAIL */}
            <input type="email" name="email" className={`${!isEmailValid ? "invalid" : ""}`} placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <span error={"Use a valid email!"} id="emailError" />
          </label>
          <br />
          <label>
            {/* PASSWORD*/}
            <input className={`${!isPasswordValid ? "invalid" : ""} ${passwordInputClass} `} type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={password} minLength={2} maxLength={25} required onChange={(e) => { setPassword(e.target.value) }} />
            <span error={"Use a valid password!"} id="passwordError" />
            <img src={passwordVisible ? EyeIconHide : EyeIcon} alt="eye-icon" className={`eyeIconRegister1 ${password && password.length >= 6 && "eyeIconVisible"}`} onClick={(e) => handleShowPassword(e)} />

          </label>
          <br />
          <label>
            {/* CONFIRM PASSWORD */}
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" className={`confirmPasswordInputClass ${!isConfirmPasswordValid ? "invalid" : ""}`} value={cpass} onChange={(e) => { setCpass(e.target.value) }} minLength={6} maxLength={256} required />
            <span error={"Passwords do not match!"} id="cpassError" />
            <img src={confirmPasswordVisible ? EyeIconHide : EyeIcon} alt="eye-icon" className="eyeIconRegister2" onClick={(e) => { handleShowConfirmPassword(e) }} />
          </label>
          <br />
          <label> {/* NEWSLETTER */}
            <input type="checkbox" name="newsletter" checked={newsletter} onChange={handleNewsletterChange} />
          </label>
          <span className="newsletter">Send me newsletters, tricks and updates. </span>
          <br />
          <input type="submit" value="SIGN IN" className="signInButton"
            onClick={(e) => {
              e.preventDefault();
              signup(user)
              // const result = await signup(user);
              // if (result.email === false) {
              setName("");
              setEmail("");
              setPassword("");
              setCpass("");
              // alert("Account creato correttamente !");
              // } else {
              //   alert("godo");
              // }
            }} disabled={disableForm} />
        </form>

        <div className="registerSign text-focus-in">
          Already have an account? <Link to="/" className="colorRegister">Login now</Link>
        </div>
      </div>
    </div>

  );
}

export default RegisterPage;