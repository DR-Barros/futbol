import React, { useEffect, useState, useRef } from "react";

export interface Event {
  period: number;
  timestamp: string;
  type: string;
  team: string;
  player: string;
  location: [number | null, number | null];
  [key: string]: any; // Permite propiedades adicionales
}

interface Props {
  homeTeam: string;
  awayTeam: string;
  events: Event[];
}

const FIELD_WIDTH = 120;
const FIELD_HEIGHT = 80;

const FootballField: React.FC<Props> = ({homeTeam, awayTeam, events}) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentEventIndex((prev) =>
        prev < events.length - 1 ? prev + 1 : 0
      );
    }, 300);

    return () => clearInterval(interval);
  }, [isPlaying, events]);

  useEffect(() => {
    console.log("Current Event Index:", events);
  }, [events.length]);

  const current = events[currentEventIndex];
  console.log("Current Event:", current);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", width: "600px", height: "400px" }}>
        <svg width="600" height="400" style={{ background: "lightgreen", border: "2px solid black" }}>
            {/* Campo */}
            <rect x="0" y="0" width="600" height="400" stroke="black" fill="none" />
            <line x1="300" y1="0" x2="300" y2="400" stroke="black" />
            <circle cx="300" cy="200" r="30" stroke="black" fill="none" />

            {/* Area Grande */}
            <line x1="600" y1="90" x2="517.5" y2="90" stroke="black" />
            <line x1="517.5" y1="90" x2="517.5" y2="310" stroke="black" />
            <line x1="600" y1="310" x2="517.5" y2="310" stroke="black" />

            <line x1="0" y1="90" x2="82.5" y2="90" stroke="black" />
            <line x1="82.5" y1="90" x2="82.5" y2="310" stroke="black" />
            <line x1="0" y1="310" x2="82.5" y2="310" stroke="black" />

            {/* Area Pequeña */}
            <line x1="600" y1="140" x2="572.5" y2="140" stroke="black" />
            <line x1="572.5" y1="140" x2="572.5" y2="260" stroke="black" />
            <line x1="600" y1="260" x2="572.5" y2="260" stroke="black" />
            <line x1="0" y1="140" x2="27.5" y2="140" stroke="black" />
            <line x1="27.5" y1="140" x2="27.5" y2="260" stroke="black" />
            <line x1="0" y1="260" x2="27.5" y2="260" stroke="black" />


            {/* Evento */}
            {current && current.location && current.location[0] !== null && current.location[1] !== null && (
              <>
              <circle
                  cx={current.team === homeTeam ? (current.location[0] / FIELD_WIDTH) * 600 : 600 - (current.location[0] / FIELD_WIDTH) * 600}
                  cy={current.team === homeTeam ? (current.location[1] / FIELD_HEIGHT) * 400 : 400 - (current.location[1] / FIELD_HEIGHT) * 400}
                  r={8}
                  fill={current.team === homeTeam ? "blue" : "red"}
              />
              {current.pass_end_location && (
                  <line
                      x1={current.team === homeTeam ? (current.location[0] / FIELD_WIDTH) * 600 : 600 - (current.location[0] / FIELD_WIDTH) * 600}
                      y1={current.team === homeTeam ? (current.location[1] / FIELD_HEIGHT) * 400 : 400 - (current.location[1] / FIELD_HEIGHT) * 400}
                      x2={current.team === homeTeam ? (current.pass_end_location[0] / FIELD_WIDTH) * 600 : 600 - (current.pass_end_location[0] / FIELD_WIDTH) * 600}
                      y2={current.team === homeTeam ? (current.pass_end_location[1] / FIELD_HEIGHT) * 400 : 400 - (current.pass_end_location[1] / FIELD_HEIGHT) * 400}
                      stroke="black"
                      strokeWidth="2"
                  />
              )}
              {current.carry_end_location && (
                  <line
                      x1={current.team === homeTeam ? (current.location[0] / FIELD_WIDTH) * 600 : 600 - (current.location[0] / FIELD_WIDTH) * 600}
                      y1={current.team === homeTeam ? (current.location[1] / FIELD_HEIGHT) * 400 : 400 - (current.location[1] / FIELD_HEIGHT) * 400}
                      x2={current.team === homeTeam ? (current.carry_end_location[0] / FIELD_WIDTH) * 600 : 600 - (current.carry_end_location[0] / FIELD_WIDTH) * 600}
                      y2={current.team === homeTeam ? (current.carry_end_location[1] / FIELD_HEIGHT) * 400 : 400 - (current.carry_end_location[1] / FIELD_HEIGHT) * 400}
                      stroke="black"
                      strokeWidth="2"
                  />
              )}
              {current.shot_end_location && (
                  <line
                      x1={current.team === homeTeam ? (current.location[0] / FIELD_WIDTH) * 600 : 600 - (current.location[0] / FIELD_WIDTH) * 600}
                      y1={current.team === homeTeam ? (current.location[1] / FIELD_HEIGHT) * 400 : 400 - (current.location[1] / FIELD_HEIGHT) * 400}
                      x2={current.team === homeTeam ? (current.shot_end_location[0] / FIELD_WIDTH) * 600 : 600 - (current.shot_end_location[0] / FIELD_WIDTH) * 600}
                      y2={current.team === homeTeam ? (current.shot_end_location[1] / FIELD_HEIGHT) * 400 : 400 - (current.shot_end_location[1] / FIELD_HEIGHT) * 400}
                      stroke="black"
                      strokeWidth="2"
                  />
              )}
              </>
            )}
        </svg>

        </div>
        <div style={{ marginTop: 10 }}>
        <strong>Evento:</strong> {current?.type} | <strong>Periodo:</strong> {current?.period} | <strong>Tiempo:</strong> {current?.timestamp}s | <strong>Equipo:</strong> {current?.team} | <strong>Jugador:</strong> {current?.player} 
        </div>
        <div>
            <button
            onClick={() => setIsPlaying(true)}
            disabled={isPlaying || events.length === 0}
            style={{ marginTop: "10px", padding: "8px 12px", fontSize: "16px" }}
            >
            {events.length === 0 ? "Cargando..." : "Comenzar Animación"}
            </button>
            <button
            onClick={() => setIsPlaying(false)}
            disabled={!isPlaying}
            style={{ marginLeft: "10px", padding: "8px 12px", fontSize: "16px" }}
            >
            Detener Animación
            </button>
            {/* restart button */}
            <button
            onClick={() => {
                setCurrentEventIndex(0);
                setIsPlaying(false);
            }
            }
            disabled={currentEventIndex === 0}
            style={{ marginLeft: "10px", padding: "8px 12px", fontSize: "16px" }}
            >
            Reiniciar Animación
            </button>
        </div>
    </div>
  );
};

export default FootballField;
