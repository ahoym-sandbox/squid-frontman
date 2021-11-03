import { useEffect, useState } from 'react';
import { usePlayersContext } from './contexts/usePlayersContext';
import { listenAndCreateAccountSets } from './oracle';
import { xrplClient } from './XrplApiSandbox';

export function RegistrationContainer() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const { addPlayer } = usePlayersContext();

  useEffect(() => {
    if (isRegistrationOpen) {
      console.log('Registration isOpen');

      function newEntry(data: any) {
        console.log('New player joined:', data);
        addPlayer({
          address: data.playerXrplAddress,
          condition: data.condition,
          fulfillment: data.fulfillment,
        });
      }

      listenAndCreateAccountSets(newEntry);
    } else {
      console.log('Registration isClosed');
      xrplClient.disconnect();
    }
  }, [isRegistrationOpen, addPlayer]);

  return (
    <div>
      {isRegistrationOpen ? (
        <button onClick={() => setIsRegistrationOpen(false)}>
          Close Registration
        </button>
      ) : (
        <button onClick={() => setIsRegistrationOpen(true)}>
          Open Registration
        </button>
      )}
    </div>
  );
}
