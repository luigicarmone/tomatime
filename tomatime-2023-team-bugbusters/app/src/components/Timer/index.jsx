import React, { useState, useEffect } from 'react';
import sound from '../AppToma/bells.mp3'

function Timer(props) {
    const audio = new Audio(sound);
    const [timeLeft, setTimeLeft] = useState({ minutes: props.isTimerRunning.nextTime, seconds: 0 });
    const [intervalID, setIntervalID] = useState(null);
    const [visualTimer, setVisualTimer] = useState("");

    const startTimerInternal = () => {
        props.startTimer();
    }

    const stopTimerInternal = () => {
        audio.play();
        props.stopTimer();
    }

    // const updateInfoTomaInternal = () => {
    //     props.updateInfoToma();
    // }

    function manageTimer() {
        let timer;
        if (props.isTimerRunning.isRunning) {
            console.log("TIMER HAS RUNNING two");
            timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);
            setIntervalID(timer);

            return () => {
                clearInterval(intervalID);
            };
        } else {
            console.log("TIMER NOT RUNNING two");
            clearInterval(intervalID);
            setIntervalID(null);
        }
    }

    useEffect(() => {
        console.log("TIMER INIT 2: " + props.isTimerRunning.isRunning);
        console.log("TARGET: " + props.isTimerRunning.targetTimer);
        // const minutes = props.isTimerRunning.nextTime;
        // const seconds = "00";
        // setVisualTimer(minutes + ":" + seconds);
        calculateTimeLeft();
        console.log("timer : " + visualTimer);
        manageTimer();
    }, [props.isTimerRunning.isRunning]);

    function calculateTimeLeft() {
        console.log("targetTImer" + props.isTimerRunning.targetTimer);
        console.log("next timer: " + props.isTimerRunning.nextTime);
        let timeLeftInternal = {};
        let targetDate = "";

        if (!props.isTimerRunning.isRunning) {
            targetDate = new Date(new Date().getTime() + props.isTimerRunning.nextTime * 60000);
            const difference = +new Date(targetDate) - +new Date();
            timeLeftInternal = {
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            targetDate = props.isTimerRunning.targetTimer;
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0 && props.isTimerRunning.isRunning) {
                timeLeftInternal = {
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            } else {
                timeLeftInternal = { minutes: 0, seconds: 0 };
                stopTimerInternal();
                // updateInfoTomaInternal();
            }
        }
        const minutes = timeLeftInternal.minutes < 10 ? "0".concat(timeLeftInternal.minutes) : timeLeftInternal.minutes;
        const seconds = timeLeftInternal.seconds < 10 ? "0".concat(timeLeftInternal.seconds) : timeLeftInternal.seconds;
        setVisualTimer(minutes + ":" + seconds);

        return timeLeftInternal;
    };


    return (
        <div>

            {visualTimer}
            {/* <button onClick={startTimerInternal}>START</button>
            <button onClick={stopTimerInternal}>STOP</button> */}

        </div>
    );
};

export default Timer;