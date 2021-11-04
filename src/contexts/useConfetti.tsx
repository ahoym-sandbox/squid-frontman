import { createContext, FC, useCallback, useContext, useState } from 'react';

interface Confetti {
  showConfetti: boolean;
  toggleConfetti: (showConfetti: boolean) => void;
}

const ConfettiContext = createContext<Confetti>({
  showConfetti: false,
  toggleConfetti: () => null,
});

export const useConfettiContext = () => useContext(ConfettiContext);

export const ConfettiContextProvider: FC = ({ children }) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const toggleConfetti = useCallback((showConfetti: boolean) => {
    setShowConfetti(() => showConfetti);
  }, []);

  return (
    <ConfettiContext.Provider value={{ showConfetti, toggleConfetti }}>
      {children}
    </ConfettiContext.Provider>
  );
};
