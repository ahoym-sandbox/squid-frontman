import { useEffect, useState } from 'react';
import { useConfettiContext } from './contexts/useConfetti';
import { usePlayersContext } from './contexts/usePlayersContext';
import { listenAndCreateAccountSets } from './oracle';
import { xrplClient } from './XrplApiSandbox';

export function RegistrationContainer() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const { addPlayer } = usePlayersContext();
  const { toggleConfetti } = useConfettiContext();

  useEffect(() => {
    if (isRegistrationOpen) {
      toggleConfetti(false);
      console.log('Registration isOpen');

      function newEntry(data: any) {
        addPlayer({
          address: data.playerXrplAddress,
          condition: data.condition,
          fulfillment: data.fulfillment,
          isEliminated: false,
        });
      }

      listenAndCreateAccountSets(newEntry);
    } else {
      console.log('Registration isClosed');
      xrplClient.disconnect();
    }
  }, [isRegistrationOpen, addPlayer, toggleConfetti]);

  return (
    <div className="RegistrationContainer">
      {isRegistrationOpen ? (
        <button
          className="Squid-button Squid-button--open"
          onClick={() => setIsRegistrationOpen(false)}
        >
          Close Registration
        </button>
      ) : (
        <button
          className="Squid-button"
          onClick={() => setIsRegistrationOpen(true)}
        >
          Open Registration
        </button>
      )}
    </div>
  );
}
