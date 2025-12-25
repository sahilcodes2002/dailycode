import React, { useState } from 'react';
import { refresh } from '../store/atoms/refresh';
import { useRecoilState } from "recoil";
import axios from 'axios';

export function TodoCard({ todo }) {
  const formattedDate = new Date(todo.created_at).toLocaleString();
  const [fresh, setFresh] = useRecoilState(refresh);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://honoprisma.codessahil.workers.dev/updatetodo", {
        id: todo.id,
        title: editedTitle,
        description: editedDescription,
        completed: todo.completed
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });
      //console.log(response);
    } catch (error) {
      console.error("Error updating todos", error);
    } finally {
      setLoading(false);
      setIsEditing(false);
      setFresh(fresh => !fresh);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://honoprisma.codessahil.workers.dev/deletetodo", {
        id: todo.id
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });
      //console.log(response);
    } catch (error) {
      console.error("Error deleting todo", error);
    } finally {
      setLoading(false);
      setFresh(fresh => !fresh);
    }
  };

  return (
    <div className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-lg shadow-md mb-4 overflow-hidden w-auto">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-800">{formattedDate}</div>
        <button onClick={async () => {
          setLoading(true);
          const nowstatus = !todo.completed;
          try {
            const response = await axios.post("https://honoprisma.codessahil.workers.dev/updatetodo", {
              id: todo.id,
              title: todo.title,
              description: todo.description,
              completed: nowstatus
            },{
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              }
            });
            //console.log(response);
          } catch (error) {
            console.error("Error updating todos", error);
          } finally {
            setLoading(false);
            setFresh(fresh => !fresh);
          }
        }} className={`text-xs px-2 py-1 rounded ${todo.completed ? 'bg-gray-600' : 'bg-yellow-500 text-gray-800'}`}>
          {todo.completed ? 'Mark Important' : 'Important'}
        </button>
      </div>
      <div className="overflow-y-auto max-h-40">
        <h2 className="text-lg font-semibold mb-2">{todo.title}</h2>
        <p className="text-sm text-gray-300">{todo.description}</p>
      </div>
      <br></br>
      
        <div className="mt-3 flex justify-around ">
            <button className="py-1 px-3 rounded bg-gray-500 hover:bg-gray-700 text-white font-bold" onClick={handleEdit}>
            Edit
            </button>
            <button className="py-1 px-3 rounded bg-gray-500 hover:bg-gray-700 text-white font-bold" onClick={handleDelete}>
            Delete
            </button>
        
      </div>
      {isEditing && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </label>
            <label className="block mb-4">
              Description:
              <textarea
                className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
            </label>
            <div className="flex justify-end">
              <button className="py-1 px-3 rounded bg-green-500 hover:bg-green-700 text-white font-bold mr-2" onClick={handleSave}>
                Save
              </button>
              <button className="py-1 px-3 rounded bg-gray-500 hover:bg-gray-700 text-white font-bold" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="text-white">Loading...</div>
        </div>
      )}
    </div>
  );
}


export function TodoCarddel({ todo }) {
  const formattedDate = new Date(todo.created_at).toLocaleString();
  const [fresh, setFresh] = useRecoilState(refresh);
  const [loading, setLoading] = useState(false);
  //const [isEditing, setIsEditing] = useState(false);

  
//handleSave
  const handleRestore = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://honoprisma.codessahil.workers.dev/restore", {
        id: todo.id
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });
      //console.log(response);
    } catch (error) {
      console.error("Error updating todos", error);
    } finally {
      setLoading(false);
      setFresh(fresh => !fresh);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://honoprisma.codessahil.workers.dev/deletefinal", {
        id: todo.id
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });
      //console.log(response);
    } catch (error) {
      console.error("Error deleting todo", error);
    } finally {
      setLoading(false);
      setFresh(fresh => !fresh);
    }
  };

  return (
    <div className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-lg shadow-md mb-4 overflow-hidden w-auto">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-800">{formattedDate}</div>
        
      </div>
      <div className="overflow-y-auto max-h-40">
        <h2 className="text-lg font-semibold mb-2">{todo.title}</h2>
        <p className="text-sm text-gray-300">{todo.description}</p>
      </div>
      <br></br>
      
        <div className="mt-3 flex justify-around ">
            <button className="py-1 px-3 rounded bg-gray-200 hover:bg-gray-700 font-bold text-green-600" onClick={handleRestore}>
            Restore
            </button>
            <button className="py-1 px-3 rounded bg-gray-200 hover:bg-gray-700 text-red-500 font-bold" onClick={handleDelete}>
            Delete
            </button>
        
      </div>
      
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="text-white">Loading...</div>
        </div>
      )}
    </div>
  );
}