import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Login from "./components/Login"

function App() {
  // const [user, setUser] = useState(null)

  // useEffect(() => {
  //   fetch("/check_session").then((response) => {
  //     if (response.ok) {
  //       response.json().then((user) => setUser(user));
  //     }
  //   });
  // }, []);

  // function handleLogin(user) {
  //   setUser(user)
  // }

  // function handleLogout() {
  //   setUser(null)
  // }


  return (
    <>
      <header>
        {/* <Header user={user} onLogout={handleLogout} /> */}
        <Header />
      </header>
      {/* <Login onLogin={handleLogin} /> */}
      <Outlet />
    </>
  )
}

export default App
