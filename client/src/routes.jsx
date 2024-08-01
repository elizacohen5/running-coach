import App from "./App";
import Home from "./components/Dashboard/Home";
import Login from "./components/Authentication/Login"
import Signup from "./components/Authentication/Signup";
import NewPlan from "./components/CreatePlan/NewPlan";
import TrainingPlan from "./components/TrainingPlan";
import { Navigate } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import { UserRunsProvider } from "./components/UserRunsContext";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const checkAuthenticated = () => {
  if (isAuthenticated()) {
    console.log("authenticated");
  } else {
    console.log("not authenticated");
  }
};
checkAuthenticated();

const routes = [
  {
    path: "/",
    element: (
      <UserProvider>
        {" "}
        <UserRunsProvider>
          {" "}
          <App />{" "}
        </UserRunsProvider>{" "}
      </UserProvider>
    ),
    children: [
      {
        path: "/home",
        element:  <Home />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/new-plan",
        element: <NewPlan />,
      },
      {
        path: "/training-plan",
        element: <TrainingPlan />,
      },
    ],
  },
];

export default routes;
