function Greeting({isLoggedIn}){
    if(isLoggedIn){
        return <h1>----Welcome----</h1>
    }
    return <h1>***please login***</h1>
}
export default Greeting;