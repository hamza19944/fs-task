import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


const Home = () => {
    return (
        <div className="home">
            <h2>Instructions</h2>
            <p>
                - You need to access with login and password then move to topics, when choosing a topic you will be able to access the topic chat. <br /><br />
                - Feel free to sign in/out and enjoy your experince in the site
            </p>
        </div>
    );
}
 
export default Home;