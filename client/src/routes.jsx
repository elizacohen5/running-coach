import App from "./App"
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import NewPlan from "./components/CreatePlan/NewPlan"
import TrainingPlan from "./components/TrainingPlan"
import { Navigate } from "react-router-dom"
import { UserProvider } from "./components/UserContext";


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
            },
            {
                path: "/training-plan",
                element: <UserProvider> <TrainingPlan /> </UserProvider>
            }
        ]
    }
]

export default routes