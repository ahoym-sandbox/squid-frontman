import { useEffect, useState } from 'react';
import { listenAndCreateAccountSets } from './oracle';
import { xrplClient } from './XrplApiSandbox';

function onAccountSetCreationSuccess(data: {
  playerXrplAddress: string;
  condition: string;
  fulfillment: string;
}) {
  const { playerXrplAddress, condition, fulfillment } = data;
  console.log('new');

  console.log('yayaya playerXrplAddress', playerXrplAddress);
  console.log('yayaya condition', condition);
  console.log('yayaya fulfillment', fulfillment);
}

export function RegistrationContainer() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    if (isRegistrationOpen) {
      console.log('Registration isOpen');
      listenAndCreateAccountSets(onAccountSetCreationSuccess);
    } else {
      console.log('Registration isClosed');
      xrplClient.disconnect();
    }
  }, [isRegistrationOpen]);

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
