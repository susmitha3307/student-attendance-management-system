import { useState } from "react";
function Toggle(){
    const[show,setShow]=useState(false);
    return(
        <div>
            <button onClick ={()=>setShow(!show)}>
                Toggle
            </button>
            {show && <h1>**** Hello Siva ****</h1>}
        </div>
    )
}
export default Toggle;