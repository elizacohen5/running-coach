import { useState, useEffect } from "react";
import Countdown from "./Countdown";
import NextRun from "./NextRun";

function Home() {

    const [userRuns, setUserRuns] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:5555/runs/1")
        .then((r) => r.json())
        .then((runsArray) => {
            setUserRuns(runsArray)
        })
        .catch((err) => console.log(err))
    }, [])

    return (
        <>
            <Countdown />
            <NextRun userRuns={userRuns} />
        </>
    )
}

export default Home;