import { usePlayersContext } from '../../contexts/usePlayersContext';
import { Confused } from '../../faces/Confused';
import { Happy } from '../../faces/Happy';
import { Nooo } from '../../faces/Nooo';
import { Oh } from '../../faces/Oh';
import { Sad } from '../../faces/Sad';
import { publishWinnerFulfillment } from '../../oracle';
import './styles.css';

const FACES = [Oh, Nooo, Confused, Happy, Sad];

export function PlayersContainer() {
  const { players, removePlayer, resetPlayers } = usePlayersContext();
  const allPlayers = Object.values(players);
  const hasOnePlayer =
    allPlayers.filter((player) => !player.isEliminated).length === 1;

  return (
    <div className="PlayerGrid">
      {allPlayers.map((player) => {
        if (player.isEliminated) {
          return <div className="PlayerCell eliminated" key={player.address} />;
        }

        const FaceComponent = FACES[Math.floor(Math.random() * FACES.length)];

        return (
          <div
            className={`PlayerCell ${hasOnePlayer ? 'victor' : 'remove'}`}
            onClick={
              hasOnePlayer
                ? () => {
                    publishWinnerFulfillment(
                      player.address,
                      player.fulfillment,
                      resetPlayers
                    );
                  }
                : () => removePlayer(player.address)
            }
            key={player.address}
          >
            <div className="PlayerCell-content">
              <p>{player.address}</p>
              <FaceComponent />
            </div>
          </div>
        );
      })}
    </div>
  );
}
