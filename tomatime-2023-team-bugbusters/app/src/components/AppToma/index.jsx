import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "../Modal";
import { v4 as uuid } from 'uuid';
import { getTasks, UpdateTask, updateStep, postStep, getStep, getInfo } from "../../api/client";
import Timer from "../Timer";


const AppToma = ({ allTasks, setAllTasks, userId, step, setStep }) => {
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [infoToma, setInfoToma] = useState(false);
  const todoTasks = allTasks.filter((task) => task.status === "todo");
  const doneTasks = allTasks.filter((task) => task.status === "done");
  const doingTasks = allTasks.filter((task) => task.status === "doing");
  const [Modals, setModals] = useState("");
  const [taskUpdate, setTaskUpdate] = useState(null);

  const arrayStep = ["", "SHORT BREAK", "TOMATO", "SHORT BREAK", "TOMATO", "LONG BREAK", "TOMATO"];
  const arrayTime = [0, 5, 25, 5, 25, 15, 25];

  const [isTimerRunning, setTimerRunning] = useState({ isRunning: false, targetTimer: 0, nextTime: step.nextStepDuration, nextPauseValue: "SHORT BREAK" });
  const [isStop, setIsStop] = useState(false);
  // const [realoading, setReloading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const info = await getInfo(userId); // Chiamata asincrona a getInfo
  //     setInfoToma(info); // Aggiorna il valore di infoToma con i dati ottenuti
  //   };
  //   fetchData(); // Chiama la funzione asincrona
  // }, [userId]);

  useEffect(() => {
    if (step.nextStep === 1 && step.step !== 6) {
      const zeroTomatoDuration = new Date(new Date().getTime() + step.nextStepDuration * 60000);
      const updateRunning = { ...isTimerRunning, isRunning: isStop, targetTimer: zeroTomatoDuration, nextTime: step.nextStepDuration, nextPause: 5, nextPauseValue: "SHORT BREAK" };
      setTimerRunning(updateRunning);

    } else {
      const data = step.startTime.replace("T", " ").replace("Z", "");
      const dbDate = new Date(data);
      dbDate.setHours(dbDate.getHours() + 2);
      const differentDate = new Date(dbDate.getTime() + step.duration * 60000) - new Date().getTime();
      const difference = ((Math.floor(differentDate)) / 1000) / 60;

      if (difference < (step.duration) && step.brokenDate === null) {
        const currentDate = new Date(new Date().getTime() + difference * 60000);
        const updateRunning = { ...isTimerRunning, isRunning: true, targetTimer: currentDate, nextTime: step.nextStepDuration, nextPause: arrayTime[step.step], nextPauseValue: arrayStep[step.step] }
        setTimerRunning(updateRunning);

      } else {
        const currentDate = new Date(new Date().getTime() + step.duration * 60000);
        console.log("il prossimo step: " + step.nextStep);
        const nextPauseInternal = arrayTime[isTimerRunning.isRunning ? step.nextStep : step.step];
        const nextEventInternal = arrayStep[isTimerRunning.isRunning ? step.nextStep : step.step];
        const updateRunning = { ...isTimerRunning, isRunning: isStop, targetTimer: currentDate, nextTime: step.nextStepDuration, nextPause: nextPauseInternal, nextPauseValue: nextEventInternal }
        setTimerRunning(updateRunning);
      }
    }
  }, [step]);

  // avvia il timer 
  const startTimer = async () => {
    setIsStop(true);
    setShowPomodoro(true);
    const result = await postStep(userId);
    const stepLogin = await getStep(userId);
    setStep(stepLogin);
    return {
      isTimerRunning, setTimerRunning
    }
  }

  // async function updateInfoToma() {
  //   const info = await getInfo(userId);
  //   setInfoToma(info);
  // }
  // ferma il timer
  const stopTimer = async () => {
    setIsStop(false);
    setShowPomodoro(false);
    console.log("STOP TIMER");
    console.log("APPSTOP:" + isTimerRunning.isRunning);
    const result = await updateStep(userId);
    const resultGet = await getStep(userId);
    setStep(resultGet);
    // updateInfoToma();
    moveDoingTodo();
  }

  const canClickButton = () => { return doingTasks.length > 0; }
  const buttonClass = isTimerRunning.isRunning ? 'rompiPomodoro' : canClickButton() ? 'bottone' : 'bottoneNone';

  const moveDoingTodo = (async () => {
    if (doingTasks.length > 0) {
      const taskObj = { userId: doingTasks[0].userId, title: doingTasks[0].title, description: doingTasks[0].description, status: "todo" };
      const resultNewTask = await UpdateTask(doingTasks[0]._id, taskObj);
      const tasks = await getTasks(userId);
      setAllTasks(tasks);
    }
  })

  const moveDoingDone = (async (e) => {
    e.preventDefault();
    if (doingTasks.length > 0) {
      const taskObj = { userId: doingTasks[0].userId, title: doingTasks[0].title, description: doingTasks[0].description, status: "done" };
      const resultNewTask = await UpdateTask(doingTasks[0]._id, taskObj);
      const tasks = await getTasks(userId);
      setAllTasks(tasks);
      const info = await getInfo(userId);
      setInfoToma(info);
    }
  })


  const navigate = useNavigate();

  function ShowModal() {
    setModals("Add");
  }

  const showModalTimerDelete = () => {
    setModals("deleteTimer");
  }

  function ProfileMenu({ onClose }) { // funzione per far uscire il bottone di logout
    return (

      <div className="profile-menu" >
        <button className="buttonEdit">Edit Profile</button>
        <button className="buttonLogout" onClick={async () => {
          navigate("/");
        }
        }>Logout</button>
        <button onClick={onClose} className="closeButton">Close</button>
      </div>
    );
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="backgroundApp">

      <div className="logoTomatime" />
      <div className="backgroundToma">
        <div className="toDoApp">TO DO
          <div className="listTODO">
            {

              todoTasks.map((task) =>
                <div key={task._id}>
                  <div className="hoverAll">
                    <div id={"task_" + task._id} onClick={(e) => {
                      setTaskUpdate(task);
                      setModals("Update");

                    }} className={doingTasks.length > 0 ? "displayBlock2 hoverBackground" : "displayBlock hoverBackground"}>

                      <span className="buttonTodo"><FontAwesomeIcon icon={faCheck} /></span><span>{task.title}</span>
                    </div>

                    <button className={doingTasks.length > 0 ? "arrowRightNone" : "arrowRight"} id={"button_" + task._id} onClick={async (e) => {
                      e.preventDefault();
                      const taskObj = { userId: task.userId, title: task.title, description: task.description, status: "doing" };
                      const resultNewTask = await UpdateTask(task._id, taskObj);
                      const tasks = await getTasks(userId);
                      setAllTasks(tasks);
                    }}>
                      <FontAwesomeIcon icon={faArrowRight} /></button>
                  </div>
                </div>
              )
            }
            <div className="addTodo" role="button" onClick={ShowModal}>
              <button className="buttonTodo2" onClick={ShowModal}>+</button>
              <p>Add task</p>
            </div>
          </div>
        </div>

        <div className="toDoneApp">DONE
          <div className="listTODO listDoneWidth">
            {doneTasks.map((task) => (
              <div key={task._id}>
                <div id={"done_" + task._id} className={doneTasks.length > 0 ? "greyBackground" : ""}>
                  <span className="checkTodo"><FontAwesomeIcon icon={faCheck} /></span>
                  {task.title}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rectangleYellow" id={uuid()}>
          <div className="timeToFocus" id={uuid()}>TIME TO FOCUS</div>
          <div className="workingAt" id={uuid()}>WORKING AT
            {doingTasks.length > 0 && (
              <div className="listDOING" id={uuid()}>
                <div>
                  {doingTasks[0].title}
                </div>
              </div>
            )}
          </div>
          <div id={uuid()} className="rectangleWhite" />

          <button id={uuid()} type="button"
            className={doingTasks.length === 0 ? 'arrowToDoneNone' : 'arrowToDone'}
            disabled={doingTasks.length === 0}
            onClick={moveDoingDone} />

          <button id={uuid()} type="button"
            className={doingTasks.length === 0 ? 'arrowToDoNone' : 'arrowToDo'}
            disabled={doingTasks.length === 0}
            onClick={moveDoingTodo} />
          <div id="timer">
            <Timer isTimerRunning={isTimerRunning} startTimer={startTimer} stopTimer={stopTimer} />
          </div>
          <div id="breakShort">NEXT: {isTimerRunning.nextPauseValue} ({isTimerRunning.nextPause} MIN)</div>

          <button id={uuid()} className={buttonClass}
            onClick={isTimerRunning.isRunning ? stopTimer : startTimer}
            disabled={!canClickButton()}> {isTimerRunning.isRunning ? '' : ''}
          </button>

          {isTimerRunning.isRunning && (
            <button id={uuid()} className="rompiPomodoro" onClick={showModalTimerDelete}>
            </button>)}


        </div>
      </div>

      <div className="iconCounter">
        <div className="iconTasksDone" />
        <div className="iconTomatoDone" />
        <div className="iconSmashed" />
      </div>

      <div className="numberCounter">
        <span className="taskCount">{infoToma?.taskCount}</span>
        <span className="tomaCount">{infoToma?.tomaCount}</span>
        <span className="brokenCount">{infoToma?.brokenCount}</span>
      </div>

      <div className="propic" onClick={toggleProfile} />
      {isProfileOpen && <ProfileMenu onClose={toggleProfile} />}

      <div className={showPomodoro ? "animationPomodoro slide-in-left2" : "animationPomodoroNone slide-out-left2"} />

      <Modal Modals={Modals} setModals={setModals} userId={userId} setAllTasks={setAllTasks} setTaskUpdate={setTaskUpdate} taskUpdate={taskUpdate} stopTimer={stopTimer} />
    </div>
  );
}

export default AppToma;