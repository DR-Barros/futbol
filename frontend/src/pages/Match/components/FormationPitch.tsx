import "./FormationPitch.css";
import type { Lineup } from "../../../types/matches";

const FIELD_WIDTH = 100;  // porcentaje
const FIELD_HEIGHT = 100;

type PositionKey =
    | "Goalkeeper"
    | "Right Back"
    | "Left Back"
    | "Right Center Back"
    | "Left Center Back"
    | "Center Back"
    | "Right Wing Back"
    | "Left Wing Back"
    | "Center Defensive Midfield"
    | "Right Defensive Midfield"
    | "Left Defensive Midfield"
    | "Right Center Midfield"
    | "Left Center Midfield"
    | "Center Midfield"
    | "Right Midfield"
    | "Left Midfield"
    | "Right Wing"
    | "Left Wing"
    | "Center Forward"
    | "Right Center Forward"
    | "Left Center Forward";


const POSITION_MAP: Record<PositionKey, { x: number; y: number }> = {
    "Goalkeeper": { x: 50, y: 5 },
    "Right Back": { x: 75, y: 20 },
    "Left Back": { x: 25, y: 20 },
    "Right Center Back": { x: 65, y: 15 },
    "Left Center Back": { x: 35, y: 15 },
    "Center Back": { x: 50, y: 15 },
    "Right Wing Back": { x: 85, y: 25 },
    "Left Wing Back": { x: 15, y: 25 },
    "Center Defensive Midfield": { x: 50, y: 30 },
    "Right Defensive Midfield": { x: 65, y: 30 },
    "Left Defensive Midfield": { x: 35, y: 30 },
    "Right Midfield": { x: 80, y: 45 },
    "Left Midfield": { x: 20, y: 45 },
    "Center Midfield": { x: 50, y: 45 },
    "Right Center Midfield": { x: 65, y: 45 },
    "Left Center Midfield": { x: 35, y: 45 },
    "Right Wing": { x: 80, y: 60 },
    "Left Wing": { x: 20, y: 60 },
    "Left Center Forward": { x: 35, y: 60 },
    "Right Center Forward": { x: 65, y: 60 },
    "Center Forward": { x: 50, y: 60 },
    
};

export default function FormationPitch({ lineup}: { lineup: Lineup[]}) {
    console.log("lineup", lineup);
    const local_players = lineup[0].tactics.lineup;
    const away_players = lineup[1].tactics.lineup;
    return (
        <div className="formation-container">
        <h3>{lineup[0].team}</h3>
        <svg viewBox="0 0 100 150" className="pitch">
            <line x1="0" y1="75" x2="100" y2="75" stroke="white" strokeWidth="0.5" />
            <circle cx="50" cy="75" r="10" fill="none" stroke="white" strokeWidth="0.5" />

            {/* Area */}
            <rect x="25" y="0" width="50" height="20" fill="none" stroke="white" strokeWidth="0.5" />
            <rect x="25" y="130" width="50" height="20" fill="none" stroke="white" strokeWidth="0.5" />

            {/* Jugadores */}
            {local_players.map((player, index) => {
            const pos = POSITION_MAP[player.position as PositionKey] || { x: 50, y: 50 };
            return (
                <g key={index}>
                <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="3"
                    fill="white"
                    stroke="black"
                    strokeWidth="0.5"
                />
                <text
                    x={pos.x}
                    y={pos.y + 7}
                    fontSize="4"
                    fill="black"
                    textAnchor="middle"
                >
                    {player.shirt_number}
                </text>
                <title>{player.player_name}</title>
                </g>
            );
            })}
            {away_players.map((player, index) => {
            const pos = POSITION_MAP[player.position as PositionKey] || { x: 50, y: 50 };
                return (
                    <g key={index}>
                    <circle
                        cx={100 -pos.x}
                        cy={145- pos.y}
                        r="3"
                        fill="blue"
                        stroke="black"
                        strokeWidth="0.5"
                    />
                    <text
                        x={100 -pos.x}
                        y={145- pos.y + 8}
                        fontSize="4"
                        fill="black"
                        textAnchor="middle"
                    >
                        {player.shirt_number}
                    </text>
                    <title>{player.player_name}</title>
                    </g>
                );
            })}
        </svg>
        <h3>{lineup[1].team}</h3>
        </div>
    );
}
