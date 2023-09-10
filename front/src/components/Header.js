import Login from "../scene/login/Login";
import { NavLink, useNavigate } from "react-router-dom";
import "./style.css"
import { useEffect, useState } from "react";

const Header = ({ user, setToken, logged, setLogged }) => {
    const [loginData, setLoginData] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        setLoginData(JSON.parse(localStorage.getItem("login")));
    }, [user])

    const handleLogout = () => {
        setToken("")
        setLogged(false)
        localStorage.removeItem("login")
        navigate("/auth", {replace: true}) 
        window.location.reload()
    }
    return (
        <header className="header">
            <h1>Site.</h1>
            <nav>
                <NavLink exact to="/">Home</NavLink>
                <NavLink to={`/topics/${loginData?.user?.login}%20${loginData?.token}`}>Topics</NavLink>
                {
                    logged ? 
                    (<>
                        <span>{loginData?.user?.name}</span>
                        <span className="logout" onClick={() => handleLogout()}>Logout</span>
                    </>) : (<NavLink to="/auth">Login</NavLink>)}
            </nav>
        </header>
    );
}

export default Header;