import { useState } from 'react'
import './App.css'
import Sidemenu from './components/Sidemenu'
import Window from './components/Window'

function App() {
  const [mode, setMode] = useState("zoom")
  const [map, setMap] = useState("Fracture")
  const [cursor, setCursor] = useState("grab")
  const [killPoints, setKillPoints] = useState([])
  const [deathPoints, setDeathPoints] = useState([])
  const [latestTransform, setLatestTransform] = useState(null)
  return (
    <div className="flex flex-row">
      <Sidemenu mode={mode} setMode={setMode} setCursor={setCursor} deathPoints={deathPoints} killPoints={killPoints} latestTransform={latestTransform}/>
      <Window 
      width={600}
      height={600}
      mode={mode} 
      setMode={setMode} 
      cursor={cursor} 
      setCursor={setCursor} 
      killPoints={killPoints} 
      setKillPoints={setKillPoints}
      deathPoints={deathPoints}
      setDeathPoints={setDeathPoints}
      setLatestTransform={setLatestTransform}
      />
    </div>
  )
}

export default App
