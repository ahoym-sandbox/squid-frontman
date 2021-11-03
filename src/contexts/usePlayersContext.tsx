import { createContext, FC, useCallback, useContext, useState } from 'react';

type Player = {
  address: string;
  condition: string;
  fulfillment: string;
};

type PlayersMap = {
  [playerAddress: string]: Player;
};

interface PlayerContext {
  players: PlayersMap;
  addPlayer: (player: Player) => void;
  removePlayer: (playerAddress: string) => void;
}

const PlayersContext = createContext<PlayerContext>({
  players: {},
  addPlayer: () => null,
  removePlayer: () => null,
});

export const usePlayersContext = () => useContext(PlayersContext);

export const PlayersContextProvider: FC = ({ children }) => {
  const [players, setPlayers] = useState<PlayersMap>({});

  const addPlayer = useCallback(
    (player: Player) => {
      players[player.address] = player;
      console.log('addPlayer =====', players);
      setPlayers({ ...players });
    },
    [players]
  );

  const removePlayer = useCallback(
    (playerAddress: string) => {
      delete players[playerAddress];
      console.log('removePlayer =====', players);
      setPlayers({ ...players });
    },
    [players]
  );

  console.log('=========================');
  console.log('TEST LOG HERE', players);
  console.log('=========================');

  return (
    <PlayersContext.Provider value={{ players, addPlayer, removePlayer }}>
      {children}
    </PlayersContext.Provider>
  );
};
