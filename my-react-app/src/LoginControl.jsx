import { useState } from "react";
function LoginControl(){
    const[isLoggedIn,setisLoggedIn]=useState(false);
    return(
        <div>
            {isLoggedIn ? (
            <button onClick={()=>setisLoggedIn(false)}>
            logout
            </button>
        ):(
            <button onClick={()=>setisLoggedIn(true)}>
                login
            </button>
        )}
        </div>
    )
}
export default LoginControl;