import { usePlayersContext } from '../../contexts/usePlayersContext';
import { publishWinnerFulfillment } from '../../oracle';
import './styles.css';

export function PlayersContainer() {
  const { players, removePlayer } = usePlayersContext();

  console.log('PlayersContainer', players);

  return (
    <div className="PlayerGrid">
      {Object.values(players).map((player) => (
        <div className="PlayerCell" key={player.address}>
          <div className="PlayerCell-content">
            <p>{player.address}</p>
            <button onClick={() => removePlayer(player.address)}>Remove</button>
            <button
              onClick={() =>
                publishWinnerFulfillment(player.address, player.fulfillment)
              }
            >
              Declare Winner
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
