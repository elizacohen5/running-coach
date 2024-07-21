import App from "./App"
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import NewPlan from "./components/CreatePlan/NewPlan"
import { Navigate } from "react-router-dom"


const isAuthenticated = () => {
    return !!localStorage.getItem('token');
}

const checkAuthenticated = () => {
    if (isAuthenticated()) {
        console.log("authenticated")
    }
    else {
        console.log('not authenticated')
    }
    }
checkAuthenticated()

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/home",
                element: isAuthenticated() ? <Home /> : <Navigate to="/login" /> 
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/new-plan",
                element: <NewPlan />
            }
        ]
    }
]

export default routes