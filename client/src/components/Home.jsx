import { useState, useEffect } from "react";
import Countdown from "./Countdown";
import NextRun from "./NextRun";

function Home() {

    const [userRuns, setUserRuns] = useState([])
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

    useEffect(() => {
        if (user) {
        // console.log("Fetching runs for", user)
        fetch(`http://127.0.0.1:5555/runs/${user.id}`)
        .then((r) => r.json())
        .then((runsArray) => {
            // console.log("Runs fetched: ", runsArray)
            setUserRuns(runsArray)
        })
        .catch((err) => console.log(err))
        }
    }, [user]) // re-fetch runs depending on the user state

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <p>Welcome, {user.name} </p>
            <p>{message}</p>
            <Countdown />
            <NextRun userRuns={userRuns} />
        </>
    )
}

export default Home;