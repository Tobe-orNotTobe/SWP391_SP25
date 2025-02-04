
import "./App.scss"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LogInPage from "./pages/LogInPage"
import RegisterPage from "./pages/RegisterPage"



function App() {


  return (
    <> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/homepage" element={<HomePage/>}/>
          <Route path="/login" element={<LogInPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
