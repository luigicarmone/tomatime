import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./modal.css";
import "./modalUpdate.css";
import "./modalDeleteTimer.css";
import { AddTasks, getTasks, UpdateTask } from "../../api/client";
import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import Pencil from "./pencil.png";
import { DeleteModal } from "../DeleteModal/deleteModal";

const Modal = ({ Modals, setModals, userId, setAllTasks, taskUpdate, setTaskUpdate, stopTimer }) => {

    const [taskId, setTaskId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("todo");

    const newTask = { title: title, description: description };
    const newTaskUpdate = { userId: userId, title: title, description: description, status: status };

    function CloseModal() {
        setModals(false);
        setTaskUpdate(null)
        // setTaskId('');
        setTitle('');
        setDescription('');
    }

    function showDeleteModal() {
        if (taskUpdate != undefined) {
            setTaskId(taskUpdate._id);
            setTitle(taskUpdate.title);
            setDescription(taskUpdate.description);
        }
        setModals("Delete");
    }

    return (
        <div>
            <div className={Modals === "Add" ? "ModalShow" : "ModalClose"}>
                <div className="addTaskModal">
                    <form name="Add">
                        <input type="hidden" name="idModal"></input>

                        <input type="" name="titleModal" className="textModal"
                            placeholder="Title" value={title}
                            onChange={(e) => { setTitle(e.target.value) }}></input>

                        <div className="pencil">
                            <img src={Pencil} alt="pencil" />
                        </div>

                        <textarea name="descriptionModal" className="descriptionModal"
                            placeholder="Description" value={description}
                            onChange={(e) => { setDescription(e.target.value) }}></textarea>

                        <button name="cancelModal" className="cancelButtonModal" onClick={(e) => {
                            e.preventDefault();
                            CloseModal();
                        }
                        }>Cancel</button>
                        <button type="hidden" name="addModal" className="addButtonModal"
                            onClick={async (e) => {
                                e.preventDefault();
                                const resultNewTask = await AddTasks(userId, newTask);
                                console.log(resultNewTask);
                                if (resultNewTask.id !== null) {
                                    const tasks = await getTasks(userId);
                                    setAllTasks(tasks);
                                    CloseModal();
                                }

                            }}>Add task</button>

                    </form>
                </div>
            </div>

            <div className={Modals === "Update" ? "ModalShowUpdate" : "ModalClose"}>
                <div className="addTaskModalUpdate">
                    <form name="Add" onBlur={async (e) => {
                        e.preventDefault();
                        const resultNewTask = await UpdateTask(taskId, newTaskUpdate);
                        console.log(resultNewTask);
                        const tasks = await getTasks(userId);
                        setAllTasks(tasks);
                    }}>

                        <input type="hidden" name="idModal"></input>
                        <input type="" name="titleModal" className="textModalUpdate"
                            placeholder="Title" value={taskUpdate != undefined ? taskUpdate.title : title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (taskUpdate != undefined) {
                                    setTaskId(taskUpdate._id);
                                    setDescription(taskUpdate.description);
                                    setTaskUpdate(undefined);
                                }
                            }} ></input>

                        <div className="pencilUpdate">
                            <img src={Pencil} alt="pencil" />
                        </div>

                        <textarea name="descriptionModal" className="descriptionModalUpdate"
                            placeholder="Description"
                            value={taskUpdate != undefined ? taskUpdate.description : description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                if (taskUpdate != undefined) {
                                    setTaskId(taskUpdate._id);
                                    setTitle(taskUpdate.title);
                                    setTaskUpdate(undefined);
                                }
                            }}></textarea>
                    </form>
                    <button name="closeModalUpdate" className="closeModalUpdate" onClick={(e) => {
                        e.preventDefault();
                        CloseModal();
                    }
                    }><FontAwesomeIcon className="closeIcon" icon={faXmark} /></button>

                    <button name="delete" className="deleteIconUpdate">
                        <FontAwesomeIcon className="trashIconUpdate" icon={faTrash}
                            onClick={showDeleteModal} /></button>
                </div>
            </div>
            <div className={Modals === "deleteTimer" ? "ModalShowUpdate" : "ModalClose"}>
                <div className="deleteTimerModal">
                    <h3 className="stopTomatoText">Stop tomato</h3>
                    <span className="stopTomatoDesc">Do you want to restart another tomato?</span>
                    <div className="buttonDeleteTimer">
                        <button
                            name="cancelModal"
                            className="cancelButtonModal"
                            onClick={(e) => {
                                e.preventDefault();
                                CloseModal();
                            }}
                        >
                            Cancel
                        </button>
                        <button onClick={() => {
                            stopTimer();
                            CloseModal();
                        }} className="stopItButton">
                            Stop it!
                        </button>
                    </div>
                </div>
            </div>

            < DeleteModal taskId={taskId} newTaskUpdate={newTaskUpdate} Modals={Modals} setModals={setModals} setAllTasks={setAllTasks} userId={userId} CloseModal={CloseModal} />
        </div>
    )
}

export { Modal };