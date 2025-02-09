
import "./App.scss"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LogInPage from "./pages/LogInPage"
import RegisterPage from "./pages/RegisterPage"
import {IntroductionPage, AboutUsPage, OurTeamPage} from "./pages/IntroductionPage"



function App() {


  return (
    <> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/homepage" element={<HomePage/>}/>
          <Route path="/login" element={<LogInPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/introduction" element={<IntroductionPage/>}/>
          <Route path="/about-us" element={<AboutUsPage/>}/>
          <Route path="/team" element={<OurTeamPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
