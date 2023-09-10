import "./login.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = ({ setLogged }) => {
    const [user, setUser] = useState({})
    const [err, setErr] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const navigate = useNavigate()
    
    const url = "http://localhost:8008"
    // a function to authenticate the user
    const handleLogin = (e) => {
        e.preventDefault()
        localStorage.removeItem("login")
        setUser({login: e.target[0].value, password: e.target[1].value})
    }
    // function for returning the data
    const handleData = async () => {
        let res = await fetch(url + "/auth", { // send a post request to the server
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        }).then(res => res.json())
        .then(dt => {
            localStorage.setItem("login", JSON.stringify(dt))
            setTimeout(() => {
                const dt = JSON.parse(localStorage.getItem("login"))
                if(dt !== "Incorrect user information") {
                    setLogged(true)
                    localStorage.removeItem("topics")
                    navigate(`/topics/${dt?.user?.login}%20${dt?.token}`)
                }
            }, 500)
        }).catch((error) => {
            setErr(true)
            console.log(error.message);
        })
    }
    // useEffect(() => {localStorage.removeItem("login")}, [])
    return (
        <div className="login">
            <h2>login</h2>
            <form action="" onSubmit={(e) => handleLogin(e)}>
                <label>Email</label>
                <input type="text" placeholder="Add Your Email" autoComplete="true"/>
                <label>Password</label>
                <input type={!showPass ? "password" : "text"} placeholder="Add Your Password" autoComplete="true"/>
                <button type="submit" onClick={handleData}>Login</button>
            </form>
            {err ? (<div>Entred data is not correct</div>) : ""}
        </div>
    );
}
 
export default Login;