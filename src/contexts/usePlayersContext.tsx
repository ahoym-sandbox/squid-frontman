import { createContext, FC, useCallback, useContext, useState } from 'react';

type Player = {
  address: string;
  condition: string;
  fulfillment: string;
  isEliminated: boolean;
};

type PlayersMap = {
  [playerAddress: string]: Player;
};

interface PlayerContext {
  players: PlayersMap;
  addPlayer: (player: Player) => void;
  removePlayer: (playerAddress: string) => void;
  resetPlayers: () => void;
}

const PlayersContext = createContext<PlayerContext>({
  players: {},
  addPlayer: () => null,
  removePlayer: () => null,
  resetPlayers: () => null,
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
      const player = players[playerAddress];
      player.isEliminated = true;
      players[playerAddress] = player;
      setPlayers({ ...players });
    },
    [players]
  );

  const resetPlayers = useCallback(() => {
    setPlayers({});
  }, [setPlayers]);

  return (
    <PlayersContext.Provider
      value={{ players, addPlayer, removePlayer, resetPlayers }}
    >
      {children}
    </PlayersContext.Provider>
  );
};
