import { useState, useEffect } from "react";
import Countdown from "./Countdown";
import NextRun from "./NextRun";
import RunTypeChart from "./RunTypeChart";

function Home() {
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async() => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:5555/home', {
                headers: {
                    'Authorization': token
                }
            });
            const data = await response.json();
            if (data.user) {
                // console.log("User data fetched:", data.user)
                setUser(data.user);
            } else {
                setMessage(data.message)
            }
        };
        fetchData();
    }, [])

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <p>Welcome, {user.name} </p>
            <p>{message}</p>
            <Countdown user={user} />
            <NextRun />
            <RunTypeChart />
        </>
    )
}

export default Home;