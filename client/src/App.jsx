import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Login from "./components/Authentication/Login"

function App() {

  return (
    <>
      <header>
        <Header />
      </header>
      <Outlet />
    </>
  )
}

export default App
