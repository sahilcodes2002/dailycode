import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import { enUS } from "date-fns/locale";
import { startOfWeek as startWeek } from "date-fns";
import axios from "axios";
//

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const WeekCalendar = ({ addevent }) => {
  useEffect(() => {
    async function getdata() {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8787/getweekevents`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success) {
          const d = await response.data.res;
          for (const r of d) {
            const d = await r.date.split("T")[0];
            const task = await r.task;
            const completed = r.completed;
            setTasks((prevTasks) => ({
              ...prevTasks,
              [d]: [...(prevTasks[d] || []), { task, completed: completed }],
            }));
          }
          // setTasks((prevTasks) => ({
          //   ...prevTasks,
          //   [d]: [...(prevTasks[d] || []), { task: t, completed: false }],
          // }));
        } else {
          console.error("Error fetching events", response.data);
        }
      } catch (error) {
        console.error("Error fetching todos", error);
      } finally {
        //setLoading(false);
      }
    }

    getdata();
  }, []);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const lightColors = [
    "bg-gray-100",
    "bg-red-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-indigo-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-teal-100",
    "bg-rose-100",
    "bg-orange-100",
    "bg-lime-100",
    "bg-cyan-100",
    "bg-emerald-100",
    "bg-violet-100",
  ];

  const [currentWeek, setCurrentWeek] = useState(
    startWeek(new Date(), { weekStartsOn: 1 })
  );
  const [tasks, setTasks] = useState({});

  const getFormattedDate = (date) => format(date, "yyyy-MM-dd");

  const addTask = async (day, date) => {
    const task = prompt(
      `Add a task for ${day}, ${format(date, "MMMM d, yyyy")}:`
    );
    const formattedDate = getFormattedDate(date);
    const datetosend = formattedDate + "T00:00:00Z";
    if (task) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8787/addweekevent",
          {
            task: task,
            completed: false,
            date: datetosend,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const r = await response.data.res;
        const d = await r.date.split("T")[0];

        const t = await r.task;
        console.log(t);
        console.log(d);
        setTasks((prevTasks) => ({
          ...prevTasks,
          [d]: [...(prevTasks[d] || []), { task: t, completed: false }],
        }));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const toggleTaskCompletion = (date, taskIndex) => {
    setTasks((prevTasks) => {
      const updatedTasksForDate = prevTasks[date].map((task, index) =>
        index === taskIndex ? { ...task, completed: !task.completed } : task
      );
      return {
        ...prevTasks,
        [date]: updatedTasksForDate,
      };
    });
  };

  const handleSelectSlot = (slotInfo) => {
    setCurrentWeek(startWeek(slotInfo.start, { weekStartsOn: 1 }));
  };

  return (
    <div className="container mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Weekly Task Planner
      </h1>

      <div
        className={`overflow-y-auto h-72 week-calendar grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 ${
          addevent ? "smd:h-[500px]" : "smd:h-72"
        }`}
      >
        {daysOfWeek.map((day, index) => {
          const date = addDays(currentWeek, index);
          const formattedDate = getFormattedDate(date);

          return (
            <div
              key={day}
              className={`week-calendar smd:overflow-y-auto h-auto day-column bg-white border p-2 rounded-lg shadow-lg ${
                addevent ? "smd:h-[500px]" : "smd:h-72"
              }`}
            >
              <h2 className="font-bold text-center mb-4 text-sm">
                {day[0] + day[1] + day[2]} -{" "}
                {format(date, "MMMM d").split(" ")[0][0]}
                {format(date, "MMMM d").split(" ")[0][1]}
                {format(date, "MMMM d").split(" ")[0][2]}/
                {format(date, "MMMM d").split(" ")[1]}
              </h2>

              <ul className="task-list mb-4 text-center ">
                {tasks[formattedDate] && tasks[formattedDate].length > 0 ? (
                  tasks[formattedDate].map((task, idx) => {
                    const randomNumber = Math.floor(Math.random() * 15);
                    console.log(tasks);
                    return (
                      <li
                        key={idx}
                        className={`flex items-center overflow-x-auto justify-between text-sm mb-2 ${lightColors[randomNumber]} text-gray-700 border border-black px-1 rounded-md`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() =>
                            toggleTaskCompletion(formattedDate, idx)
                          }
                          className="mr-2"
                        />
                        {task.completed ? <s>{task.task}</s> : task.task}
                      </li>
                    );
                  })
                ) : (
                  <li className="text-gray-400">No tasks</li>
                )}
              </ul>

              <button
                onClick={() => addTask(day, date)}
                className="w-full bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                +
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendar;
