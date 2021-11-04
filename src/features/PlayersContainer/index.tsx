import { usePlayersContext } from '../../contexts/usePlayersContext';
import { publishWinnerFulfillment } from '../../oracle';
import './styles.css';

export function PlayersContainer() {
  const { players, removePlayer } = usePlayersContext();
  const hasOnePlayer = Object.values(players).length === 1;

  return (
    <div className="PlayerGrid">
      {Object.values(players).map((player) => {
        const disablePlayer = () => removePlayer(player.address);

        return (
          <div
            className={`PlayerCell ${hasOnePlayer ? 'victor' : 'remove'}`}
            onClick={
              hasOnePlayer
                ? () => {
                    publishWinnerFulfillment(
                      player.address,
                      player.fulfillment,
                      disablePlayer
                    );
                  }
                : disablePlayer
            }
            key={player.address}
          >
            <div className="PlayerCell-content">
              <p>{player.address}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
