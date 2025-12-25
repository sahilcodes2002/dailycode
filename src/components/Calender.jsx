import axios from "axios";
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "tailwindcss/tailwind.css";
import toast from "react-hot-toast";
import { format, startOfDay, endOfDay } from "date-fns";
import { CustomToolbar } from './Cutomcalendertoolbar'
import { info } from '../store/atoms/userinfo';
import { useRecoilValue } from 'recoil';
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const initialEvents = [];

const MyCalendar = ({addevent,setaddevent,calenderevents,setcalenderevents}) => {
  
  const [events, setEvents] = useState([]);
  const allInfo = useRecoilValue(info);
  //console.log(allInfo)
  const [newEvent, setNewEvent] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    color: "bg-blue-500",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); 



  const handleAddEvent = async () => {
    const { title, startDate, startTime, endDate, endTime, color } = newEvent;
    if (!title || !startDate || !startTime || !endDate || !endTime) {
      alert(
        "Please enter all required fields: Title, Start Date, Start Time, End Date, and End Time."
      );
      return; // Exit the function if validation fails
    }
    // Combine date and time into Date objects
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    try {
      // Make a POST request to add the event
      const response = await axios.post(
        "http://127.0.0.1:8787/addevent", // Replace with your actual backend URL
        {
          title,
          color,
          start: start.toISOString(), // Ensure dates are in proper format
          end: end.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you're using JWT tokens for auth
          },
        }
      );

      console.log(response.data);

      if (response.data.success) {
        // If the event creation was successful, add the new event to the local state
        setEvents([...events, { title, start, end, color,id:response.data.res.id }]);

        // Clear the new event input fields
        setNewEvent({
          title: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          color: "bg-blue-500",
        });
        setaddevent(false)
        toast.success("Event added successfully");
        //alert("Event added successfully!");
      } else {
        console.error("Event creation failed: ", response.data);
        alert("Failed to add event. Please try again.");
      }
    } catch (error) {
      console.error("Error adding event", error);
      alert("An error occurred while adding the event.");
    }
  };

  const formatEvents = (events) => {
    return events.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getdata() {
      setLoading(true);
      try {
        // if(allInfo.calenderevents){
        //   setEvents(formatEvents(allInfo.calenderevents));
        //   return;
        // }
        const response = await axios.get(`http://127.0.0.1:8787/getevents`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          setEvents(formatEvents(response.data.res));
        } else {
          console.error("Error fetching events", response.data);
        }
      } catch (error) {
        console.error("Error fetching todos", error);
      } finally {
        setLoading(false);
      }
    }
    getdata();
  }, []);

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Set to start of the day
    return d.toISOString().split("T")[0]; // Return date part only (YYYY-MM-DD)
  };

  const handleSelectSlot = ({ start }) => {
    console.log("click");
    const normalizedStart = format(startOfDay(new Date(start)), "yyyy-MM-dd");
    setSelectedDate(normalizedStart);

    const tasksForDay = events.filter((event) => {
      const eventStart = format(
        startOfDay(new Date(event.start)),
        "yyyy-MM-dd"
      );
      const eventEnd = format(endOfDay(new Date(event.end)), "yyyy-MM-dd");
      return eventStart <= normalizedStart && eventEnd >= normalizedStart;
    });

    setTasks(tasksForDay);
    console.log(tasks);
  };

  // Function to complete and remove a task
  const handleCompleteTask = async (task) => {
    console.log(task.id);
    try {
      // Make a POST request to add the event
      const response = await axios.post(
        "http://127.0.0.1:8787/deleteevents", // Replace with your actual backend URL
        {
          event_id: task.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you're using JWT tokens for auth
          },
        }
      );

      console.log(response.data);

      if (response.data.success) {
        setTasks(tasks.filter((t) => t !== task));
        setEvents(events.filter((event) => event !== task));
        toast.success("Event deleted successfully");
        //alert("Event deleted successfully!");
      } else {
        console.error("Event deletion failed: ", response.data);
        alert("Failed to delete event. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting event", error);
      alert("An error occurred while deleting the event.");
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  // Function to set event styles dynamically
  const eventPropGetter = (event) => {
    return {
      className: `${event.color} text-white text-[0px] py-[0.1px] px-1 rounded`,
    };
  };

  const handleDateChange = (field, value) => {
    if (field === "startDate") {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        startDate: value,
        startTime: prevEvent.startTime || "00:00", // Default to 10 PM if startTime is not set
        start: new Date(`${value}T${prevEvent.startTime || "00:00"}`),
      }));
    } else if (field === "startTime") {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        startTime: value,
        start: new Date(`${prevEvent.startDate}T${value}`),
      }));
    } else if (field === "endDate") {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        endDate: value,
        endTime: prevEvent.endTime || "23:59", // Default to 10 PM if endTime is not set
        end: new Date(`${value}T${prevEvent.endTime || "23:59"}`),
      }));
    } else if (field === "endTime") {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        endTime: value,
        end: new Date(`${prevEvent.endDate}T${value}`),
      }));
    }
  };



  const CustomDateCell = ({ value, children }) => {
    return (
      <button
        type="button"
        className="rbc-button-link"
        // onClick={() => handleDateClick(value)}
        style={{ border: "none", background: "transparent", cursor: "pointer" }}
      >
        {children}
      </button>
    );
  };
  const CustomEvent = ({ event }) => (
    <div className="custom-event">
      <span>{event.title}</span> {/* Only show title, not the time */}
    </div>
  );

  return (
    <div className="z-0 md:px-5  rounded-md">
      <h1 className="text-2xl mt-4 text-gray-400 font-bold text-center">{addevent?"Add Event":"Your Calender"}</h1>
      <div>
        <div className=" ">
          {/* Event form */}

          {/* Calendar */}
          
          <div className="flex flex-col">
            <div>
              <button
                onClick={() => {
                  setaddevent((x) => !x);
                }}
              >
                {!addevent && (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                )}
                {addevent && (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </div>
            <div className={`${addevent ? "" : "hidden"}`}>
              <div className="bg-slate-400 rounded p-2 text-center">
                
                {/* Form elements */}
                {/* ... */}
                <label
                  for="first_name"
                  className="block mb-1  text-sm font-medium text-gray-900 "
                >
                  Event name
                </label>
                <div className="w-full flex justify-center">
                  <input
                    className={`w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 `}
                    type="text"
                    placeholder="Event Title"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    for="first_name"
                    className="block mb-1 mt-1 text-sm font-medium text-gray-900 "
                  >
                    Start Date
                  </label>
                  <div className="w-full flex justify-center">
                    <input
                      className={`w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 `}
                      type="date"
                      placeholder="Start Date"
                      value={newEvent.startDate}
                      onChange={(e) =>
                        handleDateChange("startDate", e.target.value)
                      }
                    />
                  </div>
                  <label
                    for="first_name"
                    className="block mb-1 mt-1 text-sm  font-medium text-gray-900 "
                  >
                    Start Time
                  </label>
                  <div className="w-full flex justify-center">
                    <input
                      className={`w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 `}
                      type="time"
                      placeholder="Start Time"
                      value={newEvent.startTime}
                      onChange={(e) =>
                        handleDateChange("startTime", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <label
                    for="first_name"
                    className="block mb-1 mt-1 text-sm font-medium text-gray-900 "
                  >
                    End Date
                  </label>

                  <div className="w-full flex justify-center">
                    <input
                      className={`w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 `}
                      type="date"
                      placeholder="End Date"
                      value={newEvent.endDate}
                      onChange={(e) =>
                        handleDateChange("endDate", e.target.value)
                      }
                    />
                  </div>
                  <label
                    for="first_name"
                    className="block mb-1 mt-1 text-sm font-medium text-gray-900 "
                  >
                    End Time
                  </label>
                  <div className="w-full flex justify-center">
                    <input
                      className={`w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 `}
                      type="time"
                      placeholder="End Time"
                      value={newEvent.endTime}
                      onChange={(e) =>
                        handleDateChange("endTime", e.target.value)
                      }
                    />
                  </div>
                </div>
                <label
                  for="first_name"
                  className="block mb-1 mt-1 text-sm font-medium text-gray-900 "
                >
                  Color
                </label>
                <div className="w-full flex justify-center">
                  <select
                    className={` w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 `}
                    value={newEvent.color}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, color: e.target.value })
                    }
                  >
                    <option value="bg-blue-400">Blue</option>
                    <option value="bg-green-400">Green</option>
                    <option value="bg-red-400">Red</option>
                    <option value="bg-yellow-400">Yellow</option>
                    <option value="bg-purple-400">Purple</option>
                    <option value="bg-pink-400">Pink</option>
                    <option value="bg-indigo-400">Indigo</option>
                    <option value="bg-teal-400">Teal</option>
                    <option value="bg-orange-400">Orange</option>
                    <option value="bg-gray-400">Gray</option>
                    <option value="bg-lime-400">Lime</option>
                    <option value="bg-amber-400">Amber</option>
                    <option value="bg-cyan-400">Cyan</option>
                    <option value="bg-rose-400">Rose</option>
                    <option value="bg-fuchsia-400">Fuchsia</option>
                  </select>
                </div>
                <div className="w-full flex justify-center">
                  <button
                    className={`mt-4 bg-[rgb(18,107,70)] hover:bg-[rgb(47,141,113)] text-white py-[10px] px-20 md:py-[13px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm`}
                    onClick={handleAddEvent}
                  >
                    Add Event
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
  style={{ height: 315 }}
  className={`flex justify-center ${addevent ? "hidden" : ""}`}
>
  <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 300, width: 320 }}
      selectable
      onSelectSlot={handleSelectSlot}
      onSelectEvent={handleSelectEvent}
      eventPropGetter={eventPropGetter}
      components={{
        toolbar: CustomToolbar,
        dateCellWrapper: CustomDateCell,
        event: CustomEvent,  // Use CustomEvent to render events without times
      }}
      views={{
        day: true, // Ensure day view is available
        month: true,
        week: true,
      }}
      defaultView="month"  // Adjust the default view
    />
{/* <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 300, width: 320 }}
  selectable
  onSelectSlot={handleSelectSlot}
  onSelectEvent={handleSelectEvent}
  eventPropGetter={eventPropGetter}
  components={{
    toolbar: CustomToolbar,
    dateCellWrapper: CustomDateCell
  }}
  //view="month"
/>; */}
</div>

        </div>
      </div>

      {/* Selected Date Tasks Popup */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
              onClick={() => setSelectedDate(null)} // Close button for the popup
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Tasks for {selectedDate}</h2>
            <ul>
              {tasks.map((task) => (
                <li
                  key={task.title}
                  className="flex mb-1 justify-between items-center"
                >
                  {task.title}
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded ml-4"
                    onClick={() => handleCompleteTask(task)}
                  >
                    Complete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Selected Event Popup */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
              onClick={() => setSelectedEvent(null)} // Close button for the popup
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Event Details</h2>
            <p>
              <strong>Title:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Start:</strong> {selectedEvent.start.toLocaleString()}
            </p>
            <p>
              <strong>End:</strong> {selectedEvent.end.toLocaleString()}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedEvent.description || "No description"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
