import { useEffect, useState } from 'react';
import { useConfettiContext } from './contexts/useConfetti';
import { usePlayersContext } from './contexts/usePlayersContext';
import { listenAndCreateAccountSets, publishMessage } from './oracle';
import { xrplClient } from './XrplApiSandbox';

export function RegistrationContainer() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean | void>(
    undefined
  );
  const { addPlayer } = usePlayersContext();
  const { toggleConfetti } = useConfettiContext();

  useEffect(() => {
    if (isRegistrationOpen) {
      toggleConfetti(false);
      console.log('Registration isOpen');
      publishMessage(`[SQUID-1] A new game is starting.`);

      function newEntry(data: any) {
        addPlayer({
          address: data.playerXrplAddress,
          condition: data.condition,
          fulfillment: data.fulfillment,
          isEliminated: false,
        });
      }

      listenAndCreateAccountSets(newEntry);
      // explicitly check for false, as `undefined` is the initial component mounted state
    } else if (isRegistrationOpen === false) {
      console.log('Registration isClosed');
      publishMessage(
        `[SQUID-0] Game has started. Admission payments will no longer be registered.`,
        xrplClient.disconnect
      );
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
