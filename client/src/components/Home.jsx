import { useState, useEffect } from "react";
import Countdown from "./Countdown";
import NextRun from "./NextRun";

function Home() {

    const [userRuns, setUserRuns] = useState([])
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch("http://127.0.0.1:5555/runs/1")
        .then((r) => r.json())
        .then((runsArray) => {
            setUserRuns(runsArray)
        })
        .catch((err) => console.log(err))
    }, [])

    useEffect(() => {
        const fetchData = async() => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:5555/home', {
                headers: {
                    'Authorization': token
                }
            });
            const data = await response.json();
            setMessage(data.message)
        };
        fetchData();
    }, [])

    return (
        <>
            <p>{message}</p>
            <Countdown />
            <NextRun userRuns={userRuns} />
        </>
    )
}

export default Home;