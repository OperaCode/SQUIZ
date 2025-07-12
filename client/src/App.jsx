import react from 'react'

import { Route,Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Landing from './pages/Landing'
import LeaderBoard from './components/LeaderBoard'
import AuthPage from './pages/AuthPage'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/authentication' element={<AuthPage/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path="/leaderboard" element={<LeaderBoard/>} />
      </Routes>
    </>
  )
}

export default App
