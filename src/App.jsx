import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Dashboard from './components/Dashboard'

function App() {

  return (
    <>
      {/* <Header/> */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        {/* <Route path='/dashboard' element={<Dashboard/>}/> */}
      </Routes>
    </>
  )
}

export default App
