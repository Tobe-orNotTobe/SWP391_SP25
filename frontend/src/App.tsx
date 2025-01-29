
import "./App.scss"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"


function App() {


  return (
    <> 
      <BrowserRouter>
        <Routes>
          <Route path="" element={<HomePage/>}/>
          <Route path="/login" element={<SignInPage/>}/>
          <Route path="/register" element={<SignUpPage/>}/>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
