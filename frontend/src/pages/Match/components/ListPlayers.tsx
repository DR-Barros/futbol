import type {Player } from "../../../types/matches";
import "./ListPlayers.css";

interface Props {
  players: Player[];
}

const ListPlayer: React.FC<Props> = ({ players }) => {
  return (
    <div className="player-list">
      {players.map((player) => {
        console.log("player", player);
        if (!player.positions || player.positions.length === 0) {
          return (
            <div key={player.player_id} className="player-card">
                <h3>{player.player_name} ({player.jersey_number})</h3>
                <p><strong>Pais:</strong> {player.country}</p>
                <p>Banca</p>
                {player.cards.length > 0 && (
                <div>
                    <p><strong>Tarjetas:</strong></p>
                    {player.cards.map((card, index) => (
                        <p key={index}>{card.card_type} – {card.time}′</p>
                    ))}
                </div>
                )}
            </div>
          );
        }
        const fromTimes = player.positions.map((p) => {
            if (!p.from) return 0; 
            const [min, sec] = p.from.split(':').map(Number);
            return min * 60 + sec;
        });
        const toTimes = player.positions.map((p) => {
            if (!p.to) return 90*60;
            const [min, sec] = p.to.split(':').map(Number);
            return min * 60 + sec;
        });

        const minFrom = Math.min(...fromTimes);
        const maxTo = Math.max(...toTimes);

        return (
          <div key={player.player_id} className="player-card">
            <h3>{player.player_name} ({player.jersey_number})</h3>
            <p><strong>Pais:</strong> {player.country}</p>
            <p><strong>En cancha:</strong> {Math.floor(minFrom / 60)}:{(minFrom % 60).toString().padStart(2, '0')} → {Math.floor(maxTo / 60)}:{(maxTo % 60).toString().padStart(2, '0')}</p>
            {player.cards.length > 0 && (
            <div>
                <p><strong>Tarjetas:</strong></p>
                {player.cards.map((card, index) => (
                    <p key={index}>{card.card_type} – {card.time}′</p>
                ))}
            </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListPlayer;