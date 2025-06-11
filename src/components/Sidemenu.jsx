import { useState } from "react";
import { CSVLink} from "react-csv";

const Sidemenu = ({ mode, setMode, setCursor, killPoints, deathPoints, latestTransform, map, setMap}) => {
    const [menuActive, setMenuActive] = useState(false)
    const [csvData, setCSVData] = useState([["Coordinate", "Kills", "Deaths", "Differential"]])
    const maps = ["Ascent", "Haven", "Icebox", "Lotus", "Pearl", "Fracture", "Split"]
    const mapMenu = maps.map((m) => (
        <li className="hover:bg-gray-600" key={m} onClick={()=>handleSetMap(m)}>{m}</li>
    ))
    
    const handleSetMap = (map) => {
        setMap(map)
        setMenuActive(false)
    }

    const handleMapMenuToggle = () => {
        setMenuActive(prev => !prev)
    }

    const handleSetMode = (target) => {
        setMode(target)
        if (target !== "zoom") {
            setCursor("crosshair")
        }
        else{
            setCursor("grab")
        }
    }
    const generateCSV = (k, d, diff) => {
        for(let i=0; i<diff.length; i++) {
            for(let j=0;j<diff.length;j++){
                if(k[i][j]!=0 || d[i][j]!=0){
                    setCSVData(prev=>[...prev, [`${i},${j}`, k[i][j], d[i][j], diff[i][j]]])
                }
            }
        }
        return csvData
    }
    const toGridCoords = (x, y, size, gridNum) => {
        const {scaleX, scaleY, translateX, translateY} = latestTransform
        const col = Math.floor((x*scaleX+translateX)/(size/gridNum))
        const row = Math.floor((y*scaleY+translateY)/(size/gridNum))
        return({row, col})
    }
    const calcDiff = (k, d) => {
        const diffGrid = Array.from({ length: 10 }, () => Array(10).fill(0));
        for(let i=1; i<k.length; i++) {
            for(let j=1;j<k.length;j++){
                diffGrid[i][j] = k[i][j]-d[i][j]
            }
        }
        return diffGrid
    }
    const handleCSV = () => {
        const killGrid = Array.from({ length: 10 }, () => Array(10).fill(0));
        const deathGrid = Array.from({ length: 10 }, () => Array(10).fill(0));
        if (killPoints) {
            killPoints.map((point) => {
            const {row, col} = toGridCoords(point.x, point.y, 600, 10)
            killGrid[row][col] += 1
        })
        } 
        if(deathPoints) {
            deathPoints.map((point) => {
            const {row, col} = toGridCoords(point.x, point.y, 600, 10)
            deathGrid[row][col] += 1
        })
        }
        const diffGrid = calcDiff(killGrid, deathGrid)
        
        generateCSV(killGrid, deathGrid, diffGrid)
    }
    return (
        <div className="min-h-100 w-1/5 bg-cyan-950 text-white flex flex-col gap-3">
            <span className="px-4 mt-5">Map</span>
            <div className="px-20 bg-black place-self-center">
                <button className="bg-fuchsia-900" onClick={handleMapMenuToggle}>{map}</button>
                {menuActive && <ul>{mapMenu}</ul>}
            </div>
            
            <span className="w-full pl-4">Mode</span>
            <div className="flex flex-row gap-3">
                
                <button className={mode === "zoom" ? "bg-fuchsia-900" : "bg-gray-700"} onClick={()=>handleSetMode("zoom")}>Drag&Zoom</button>
                <button className={mode === "kill" ? "bg-fuchsia-900" : "bg-gray-700"} onClick={()=>handleSetMode("kill")}>Label Kill</button>
                <button className={mode === "death" ? "bg-fuchsia-900" : "bg-gray-700"} onClick={()=>handleSetMode("death")}>Label Death</button>
            </div>

            
            <button className="w-fit place-self-center bg-gray-700 text-center" onClick={handleCSV}>Save</button>
            <CSVLink className="place-self-center bg-gray-700" data={csvData}>{`Download CSV (save first)`}</CSVLink>
            
            
        </div>
    )
}

export default Sidemenu