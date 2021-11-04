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
  const { players, removePlayer } = usePlayersContext();
  const hasOnePlayer = Object.values(players).length === 1;

  return (
    <div className="PlayerGrid">
      {Object.values(players).map((player) => {
        const FaceComponent = FACES[Math.floor(Math.random() * FACES.length)];
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
              <FaceComponent />
            </div>
          </div>
        );
      })}
    </div>
  );
}
