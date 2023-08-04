import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {AiOutlineEdit, AiOutlineDelete} from 'react-icons/ai';

function App() {

  const Todos = ({ todos }) => { //componente que recebe os todos e renderiza eles
    return (
      <div className="todos">
        {todos.map((todo) => {
          return (
            <div className="todo">
              <button
                onClick={() => modifyStatusTodo(todo)}
                className="checkbox"
                style={{ backgroundColor: todo.status ? "#A879E6" : "white" }}
              ></button>
              <p>{todo.name}</p> {/*todo.name é o nome da tarefa. pega no back-End*/}
              <button onClick={() => handleWithEditButtonClick(todo)}>
                <AiOutlineEdit size={20} color={"#64697b"}></AiOutlineEdit>
              </button>
              <button onClick = {() => deleteTodo(todo)}>
                <AiOutlineDelete size={20} color={"#64697b"}></AiOutlineDelete>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  async function handleWithNewButton() {
    setInputVisibility(!inputVisibility);
  }

  //atualiza se a todo foi feita ou não
  async function modifyStatusTodo (todo) {
    const response = await axios.put(`http://localhost:3333/todos`, {id: todo.id, status: !todo.status});
    getTodos(); //atualiza a lista de tarefas (o get do back-end)
  }

  async function handleWithEditButtonClick(todo) {
    setSelectedTodo(todo);
    setInputValue(todo.name);
    setInputVisibility(true);
  }

  async function getTodos() { 
    const response = await axios.get('http://localhost:3333/todos');
    setTodos(response.data);
  }

  async function createTodo() {
    const response = await axios.post('http://localhost:3333/todos', {name: inputValue, status: false}); //envia o nome da tarefa e o status para o back-end
    getTodos(); //atualiza a lista de tarefas (o get do back-end)
    setInputVisibility(!inputVisibility); 
    setInputValue(''); //limpa o input
  }

  async function deleteTodo(todo) {
    const response = await axios.delete(`http://localhost:3333/todos/${todo.id}`); //envia o nome da tarefa e o status para o back-end
    getTodos(); //atualiza a lista de tarefas (o get do back-end)
  }

  async function editTodo() {
    const response = await axios.put(`http://localhost:3333/todos`, {id:selectedTodo.id ,name: inputValue});  //id da todo selecionada
    getTodos(); 
    setInputVisibility(false);
    setSelectedTodo();
  }



  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState(''); //estado inicialmente vazio
  const [inputVisibility, setInputVisibility] = useState(false); //estado inicialmente falso, para não aparecer o input
  const [selectedTodo, setSelectedTodo] = useState(); 



  useEffect(() => { getTodos() }, []); //useEffect é um hook que executa uma função sempre que o componente é renderizado

  return (
    <div className="App">
      <header className="container">
        <div className="header">
          <h1>Todo List</h1>
        </div>
        <Todos todos={todos}></Todos>
        <input 
          value={inputValue} 
          style={{display: inputVisibility ? 'block' : 'none'}}
          onChange={(event) => setInputValue(event.target.value)} 
          className='inputName' 
          type="text" 
          placeholder="Type the task name" 
        ></input>
        <button 
        onClick={inputVisibility ? selectedTodo ? editTodo : createTodo : handleWithNewButton} //verifica se tem uma todo selecionada, se sim, edita, se não, cria
        className='newTaskButton'>{inputVisibility ? "Confirm":"+ New Task"}</button> {/*se o input estiver visível, o botão vai ser o de confirmar, se não, o de adicionar nova tarefa*/}
      </header>
    </div>
  );
}

export default App;
