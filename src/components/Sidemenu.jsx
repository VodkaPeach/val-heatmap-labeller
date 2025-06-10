import { useState } from "react";
import { CSVLink} from "react-csv";

const Sidemenu = ({ mode, setMode, setCursor, killPoints, deathPoints, latestTransform}) => {
    const [csvData, setCSVData] = useState([["Coordinate", "Kills", "Deaths", "Differential"]])
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
        for(let i=1; i<diff.length; i++) {
            for(let j=1;j<diff.length;j++){
                if(k[i][j]!=0 || d[i][j]!=0){
                    setCSVData(prev=>[...prev, [`${i},${j}`, k[i][j], d[i][j], diff[i][j]]])
                }
            }
        }
        return csvData
    }
    const toGridCoords = (x, y, size, gridNum) => {
        const {scaleX, scaleY, translateX, translateY} = latestTransform
        console.log(latestTransform)
        const col = Math.ceil((x*scaleX+translateX)/(size/gridNum))
        const row = Math.ceil((y*scaleY+translateY)/(size/gridNum))
        return({row, col})
    }
    const calcDiff = (k, d) => {
        const diffGrid = Array.from({ length: 11 }, () => Array(11).fill(0));
        for(let i=1; i<k.length; i++) {
            for(let j=1;j<k.length;j++){
                diffGrid[i][j] = k[i][j]-d[i][j]
            }
        }
        return diffGrid
    }
    const handleCSV = () => {
        console.log(killPoints)
        const killGrid = Array.from({ length: 11 }, () => Array(11).fill(0));
        const deathGrid = Array.from({ length: 11 }, () => Array(11).fill(0));
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
        console.log(csvData)
    }
    return (
        <div className="min-h-100 w-1/5 bg-black text-white">
            <div className="flex flex-row gap-3">
                <button className={mode === "zoom" ? "bg-blue-500" : "bg-gray-700"} onClick={()=>handleSetMode("zoom")}>Drag</button>
                <button className={mode === "kill" ? "bg-blue-500" : "bg-gray-700"} onClick={()=>handleSetMode("kill")}>Kill</button>
                <button className={mode === "death" ? "bg-blue-500" : "bg-gray-700"} onClick={()=>handleSetMode("death")}>Death</button>
            </div>

            <div className="flex flex-col">
                <button onClick={handleCSV}>Save csv</button>
                <CSVLink data={csvData}>Download CSV</CSVLink>
            </div>
            
        </div>
    )
}

export default Sidemenu