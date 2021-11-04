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
      setPlayers({ ...players });
    },
    [players]
  );

  const removePlayer = useCallback(
    (playerAddress: string) => {
      delete players[playerAddress];
      setPlayers({ ...players });
    },
    [players]
  );

  return (
    <PlayersContext.Provider value={{ players, addPlayer, removePlayer }}>
      {children}
    </PlayersContext.Provider>
  );
};
