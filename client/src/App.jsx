import { Outlet } from "react-router-dom"
import Header from "./components/Header"

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
