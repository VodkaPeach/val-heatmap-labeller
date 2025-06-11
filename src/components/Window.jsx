import React, { useState } from 'react';
import { Zoom } from '@vx/zoom';
import { localPoint } from '@vx/event';
import { RectClipPath } from '@vx/clip-path';

const initialTransform = {
  scaleX: 0.6,
  scaleY: 0.6,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
};

const calcGrids = () => {
  const start = 60/0.6;
  const cellSize = 60/0.6;
  const gridCount = 10;

  const gridCoords = [];

  for (let i = -1; i < gridCount; i++) {
      const coord = start + i * cellSize;
      gridCoords.push({x1: coord, y1: 0, x2: coord, y2: 1000}, {x1: 0, y1: coord, x2: 1000, y2: coord})
  }
  return gridCoords
}



const Window = ({width, height, mode, cursor, setCursor, killPoints, setKillPoints, deathPoints, setDeathPoints, setLatestTransform, map}) => {
  const grids = calcGrids().map((coords, i) => (
                    <line key={i} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} />
                  ))
  
  const handleDragStart = (e, zoom) => {
    zoom.dragStart(e)
    setCursor("grabbing")
  }
  const handleDragEnd = (e, zoom) => {
    zoom.dragEnd(e)
    setCursor("grab")
  }
  const handleJotKill = (e, zoom) => {
    const point = localPoint(e)
    const {scaleX, scaleY, translateX, translateY} = zoom.transformMatrix
    setLatestTransform(zoom.transformMatrix)
    const inverted = {
      x: (point.x - translateX)  / scaleX,
      y: (point.y - translateY)  / scaleY,
    };
    setKillPoints(prev => [...prev, {x: inverted.x, y: inverted.y}])
  }
  const handleJotDeath = (e, zoom) => {
    const point = localPoint(e)
    const {scaleX, scaleY, translateX, translateY} = zoom.transformMatrix
    setLatestTransform(zoom.transformMatrix)
    const inverted = {
      x: (point.x - translateX)  / scaleX,
      y: (point.y - translateY)  / scaleY,
    };
    setDeathPoints(prev => [...prev, {x: inverted.x, y: inverted.y}])
  }
    return(
      <div>
        <Zoom
        width={width}
        height={height}
        scaleXMin={1 / 2}
        scaleXMax={4}
        scaleYMin={1 / 2}
        scaleYMax={4}
        transformMatrix={initialTransform}
      >
        {zoom => (
          <div className="relative">
            <svg
              width={width}
              height={height}
              style={{ cursor: cursor}}
            >
              <RectClipPath id="zoom-clip" width={width} height={height} />
              <rect width={width} height={height} fill={`gray`} />
              <g transform={zoom.toString()}>
                <image href={`${import.meta.env.BASE_URL}maps/${map}.png`} x={0} y={0} preserveAspectRatio="xMidYMid meet"/>
                {killPoints.map((point, i)=>(
                  <circle key={i} cx={point.x} cy={point.y} r={6} fill='green' />
                ))}
                {deathPoints.map((point, i)=>(
                  <g key={i+"d"}>
                    <line x1={point.x - 6} y1={point.y + 6} x2={point.x + 6} y2={point.y - 6} stroke="red" strokeWidth={6} />
                    <line x1={point.x - 6} y1={point.y - 6} x2={point.x + 6} y2={point.y + 6} stroke="red" strokeWidth={6} />
                  </g>
                ))}
                <g stroke='gold'>
                  {grids}
                </g>
              </g>
              {mode=="kill" && <rect
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onMouseDown={(e)=>handleJotKill(e,zoom)}
              />}
              {mode=="death" && <rect
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onMouseDown={(e)=>handleJotDeath(e,zoom)}
              />}
              {mode=="zoom" && <rect
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onTouchStart={()=>handleDragStart(zoom)}
                onTouchMove={zoom.dragMove}
                onTouchEnd={()=>handleDragEnd(zoom)}
                onMouseDown={(e)=>handleDragStart(e, zoom)}
                onMouseMove={zoom.dragMove}
                onMouseUp={(e)=>handleDragEnd(e, zoom)}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd();
                }}
                onDoubleClick={event => {
                  const point = localPoint(event) || { x: 0, y: 0 };
                  zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                }}
              />}
            </svg>
            <div className="controls">
              <button
                className="btn btn-zoom"
                onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
              >
                +
              </button>
              <button
                className="btn btn-zoom btn-bottom"
                onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
              >
                -
              </button>
              <button className="btn btn-lg" onClick={zoom.reset}>
                Reset
              </button>
            </div>
          </div>
        )}


      </Zoom>
      <style>{`
        .btn {
          margin: 0;
          text-align: center;
          border: none;
          background: #2f2f2f;
          color: #888;
          padding: 0 4px;
          border-top: 1px solid #0a0a0a;
        }
        .btn-lg {
          font-size: 12px;
          line-height: 1;
          padding: 4px;
        }
        .btn-zoom {
          width: 26px;
          font-size: 22px;
        }
        .btn-bottom {
          margin-bottom: 1rem;
        }
        .description {
          font-size: 12px;
          margin-right: 0.25rem;
        }
        .controls {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .mini-map {
          position: absolute;
          bottom: 25px;
          right: 15px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .relative {
          position: relative;
        }
      `}</style>
      </div>
    )
}
export default Window