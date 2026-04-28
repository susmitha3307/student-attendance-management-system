/*function App(){
  return(
    <div>
      <h1>hello</h1>
      <h2>Everyone</h2>
      <h2>Name:Susmitha</h2>
      <h3>Branch:CSE</h3>
      <h3>Roll no:244m1a0531</h3>
      <h3>College:Vemu Institute of Technology</h3>
      <h3>Address:Mynagundlapalli,Chittoor</h3>
      <h3>Email:susmitha@gmail.com</h3>
    </div>
  )
}
export default App;
*/
/*function App(){
  const name="siva"
return(
  <div>
    <h1>Hello,{name}</h1>
  </div>
)
}
export default App
*/
/*function App(){
  return(
    <div>
      <table border="2">
        <thead>
          <tr>
            <th>Name</th>
            <th>Rollno</th>
            <th>Branch</th>
          </tr>
          <tr>
            <td>Susmitha</td>
            <td>531</td>
            <td>CSE</td>
          </tr>
          <tr>
            <td>Siva</td>
            <td>201</td>
            <td>EEE</td>
          </tr>
          <tr>
            <td>Pavani</td>
            <td>526</td>
            <td>CSE</td>
          </tr>
        </thead>
      </table>
    </div>
  )
}
export default App;
*/
/*function App(){
  const students=[
    {id:1,name:"Siva",age:18,course:"EEE"},
     {id:2,name:"Susmitha",age:19,course:"CSE"},
      {id:3,name:"Pavani",age:19,course:"CSE"}
  ];
  return(
    <div>
      <h4>STUDENT DETAILS</h4>
      <table border="2">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student)=>(
          <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
  }
export default App;
*/



/*import {useState} from "react";
function App(){
  const[count,setCount]=useState(0);
  return(
    <div>
      <h1>Count:{count}</h1>
      <button onClick={()=>setCount(count+1)}>
         Increase
         </button>
        <button onClick={()=>setCount(count-1)}>
       
  Decrease
      </button>
    </div>
  )
  }
  export default App;*/

  /*import Welcome from "./Welcome";
  function App(){
    return(
      <Welcome name="Siva"/>
    )
  }
  export default App;*/

/*function Header(){
    return <h1>Welcome to my app</h1>
}
function Footer(){
    return <h2>&copy; 2026 Siva</h2>
}
  function App(){
    return(
      <div>
        <Header />
        <Footer />
      </div>
    )
  }
  export default App;
  */

  /*import { useState } from "react";
  function App(){
    const[name,setName]=useState("siva");
    const[count,setCount]=useState(0);
    return(
      <div>
        <h1>Hello {name}</h1>
        <h2>Count: {count}</h2>
        <button onClick={()=>setCount(count+1)}>
      Increase
      </button>
      <button onClick={()=>setName("React learner")}>
        </button>
      </div>
    )
  }
  export default App;*/

  /*import { useState } from "react";
  function Counter(){
    const[count,setCount]=useState(0);
    return(
      <div>
        <h1>{count}</h1>
        <button onClick={()=>setCount(count+1)}>
        {count}
        </button>
      </div>
    )
  }
  export default Counter;*/

  /*import {useState} from "react";
  function App(){
    const[count,setCount]=useState(0);
    return(
      <div>
        <Display value={count} />
        <button onClick ={()=>setCount(count+1)}>
          Increase
        </button>
      </div>
    )
  }
  function Display({value}){
    return <h1>{value}</h1>
  }
  export default App;
  */

  /*import Greeting from "./Greeting";
  import Toggle from "./Toggle";
  import LoginControl from "./LoginControl";
  function App(){
    return(
      <div>
        <Greeting isLoggedIn={true}/>
        <Toggle/>
        <LoginControl/>
      </div>
    )
  }
  export default App;*/

  /*function GroceryList() {
    const grocery=["Sugar","Salt","Oil","Turmeric","Rice","Dal","Maida","Corn Flour","Wheat Flour","Pepper"];
    return(
      <ol type="i">
        {grocery.map((groceries,index)=>(
          <li key={index}>{groceries}</li>
        ))}
      </ol>
    )
  }

  export default GroceryList;*/

  /*import { useState } from "react";
  function Counter(){
    const[count,setCount]=useState(0);
    return(
      <div>
        <h1>{count}</h1>
        <button onClick={()=>setCount(count+1)}>
        {count}
        </button>
      </div>
    )
  }
  export default Counter;
  */

  /*import { useState } from "react";
  function NameForm(){
    const[name,setName]=useState(" ");
    return(
      <div>
        <input type="text" value={name}
        onChange={(e)=>setName(e.target.value)}
        />
        <p>Your Name: {name}</p>
      </div>
    )
  }
  export default NameForm;
*/

import Login from "./login";
import Admin from "./admin";
import Hod from "./hod";
import Faculty from "./faculty";
import Student from "./student";

function App() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (user?.role === "admin") return <Admin />;
  if (user?.role === "hod") return <Hod />;
  if (user?.role === "faculty") return <Faculty />;
  if (user?.role === "student") return <Student />;

  return <Login />;
}

export default App;