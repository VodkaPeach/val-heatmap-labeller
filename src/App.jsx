import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidemenu from './components/Sidemenu'
import Window from './components/Window'

function App() {
  return (
    <div className="flex flex-row">
      <Sidemenu />
      <Window width={200} height={200}/>
    </div>
  )
}

export default App
