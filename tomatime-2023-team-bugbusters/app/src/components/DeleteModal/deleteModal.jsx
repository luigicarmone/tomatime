import React, { useEffect, useState } from "react";
import "./DeleteModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { DeleteTask, getTasks } from "../../api/client";

const DeleteModal = ({ taskId, newTaskUpdate, Modals, setModals, setAllTasks, userId, CloseModal }) => {

  // function CloseDeleteModal() {
  //   setModals(false);
  // }

  return (
    <div className={Modals === "Delete" ? "backgroundModalDelete" : "ModalDeleteClose"}>
      <div className="modalDeleteBackground">
        <h1 className="deleteTaskModal"> Delete task </h1>
        <p className="descDeleteTask">
          Are you sure you want to delete this task?
        </p>
        <div className="backgroundTaskSelected">
          <FontAwesomeIcon className="iconV" icon={faCheck} />
          <div className="taskSelected"> {newTaskUpdate.title}</div>
        </div>
        <div>
          <button className="cancelButtonModal23 cancelButtonModal2" onClick={CloseModal}>
            Cancel
          </button>
          <button className="deleteButtonModal" onClick={async (e) => {
            e.preventDefault();
            const resultNewTask = await DeleteTask(taskId);
            console.log(resultNewTask);
            const tasks = await getTasks(userId);
            setAllTasks(tasks);
            CloseModal();
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export { DeleteModal };
