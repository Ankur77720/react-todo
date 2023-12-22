import { useState } from "react";
import axios from "axios";
import "./App.css";
import { useEffect } from "react";

const App = () => {
  const [ task, setTask ] = useState("");
  const [ desc, setDesc ] = useState("");
  const [ mainTask, setMainTask ] = useState([]);
  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(task, desc);
    axios.post("http://127.0.0.1:8000/createTodo", { title: task, description: desc }).then(response => {
      console.log(response)
      setTask("");
      setDesc("");
      axios.get('http://127.0.0.1:8000/getUserTodo').then(response => {
        const data = response.data
        setMainTask(data.todo)
      })
    });
  };

  const deleteHandler = async (id) => {
    const response = await axios.get('http://127.0.0.1:8000/delete/' + id)
    axios.get('http://127.0.0.1:8000/getUserTodo').then(response => {
      const data = response.data
      setMainTask(data.todo)
    })
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/getUserTodo').then(response => {
      const data = response.data
      setMainTask(data.todo)
    })

  }, [])

  let renderTask = <h2>No Task available</h2>;

  if (mainTask.length > 0) {
    renderTask = mainTask.map((t, i) => {
      return (
        <li key={i}>
          <div className="left">
            <h3>{t.title}</h3>  <p>{t.description}</p>
          </div>
          <button onClick={() => deleteHandler(t._id)}>Delete</button>
        </li>
      );
    });
  }

  return (
    <>
      <div className="main">
        <h1>To do List</h1>
        <form onSubmit={submitHandler}>
          <input
            onChange={(e) => setTask(e.target.value)}
            value={task}
            type="text"
            placeholder="Enter task here"
          />
          <br />
          <input
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            type="text"
            placeholder="Enter description here"
          />
          <br />
          <button>Add task</button>
        </form>
        <div className="showtask">
          <ul>{renderTask}</ul>
        </div>
      </div>
    </>
  );
};

export default App;
