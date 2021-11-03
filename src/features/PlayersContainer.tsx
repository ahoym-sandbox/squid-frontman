import { Fragment } from 'react';
import { usePlayersContext } from '../contexts/usePlayersContext';
import { publishWinnerFulfillment } from '../oracle';

export function PlayersContainer() {
  const { players, removePlayer } = usePlayersContext();

  console.log('PlayersContainer', players);

  return (
    <Fragment>
      {Object.values(players).map((player) => (
        <Fragment key={player.address}>
          <div>{player.address}</div>
          <div>{player.condition}</div>
          <div>{player.fulfillment}</div>
          <button onClick={() => removePlayer(player.address)}>Remove</button>
          <button
            onClick={() =>
              publishWinnerFulfillment(player.address, player.fulfillment)
            }
          >
            Declare Winner
          </button>
        </Fragment>
      ))}
    </Fragment>
  );
}
