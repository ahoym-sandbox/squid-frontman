import { xrplClient } from '../XrplApiSandbox';
import {
  createAccountSet,
  createAccountSetDataWithMeta,
} from './createAccountSet';
import { createConditionAndFulfillment } from './utilities';

const BANK_ADDRESS = 'rUEqxgBLfgoqZWC8B94shLXUV8pUxhwrnX';

function onAccountTransaction(event: any): Promise<{
  event: any;
  playerXrplAddress: string;
  condition: string;
  fulfillment: string;
}> {
  const transaction = event.transaction;

  return new Promise((resolve) => {
    if (transaction && transaction.TransactionType === 'Payment') {
      console.log('Logged payment to BANK_ADDRESS', transaction);
      const [condition, fulfillment] = createConditionAndFulfillment();

      const preparedAccountSetTx = createAccountSetDataWithMeta({
        playerXrplAddress: transaction.Account,
        condition,
        senderXrplAddress: xrplClient.wallet()?.account.address!,
      });
      createAccountSet({
        api: xrplClient.api(),
        address: xrplClient.wallet()?.account.address!,
        secret: xrplClient.wallet()?.account.secret!,
        accountSetMetadataTx: preparedAccountSetTx,
        onSuccess: (event: any) => {
          resolve({
            event,
            playerXrplAddress: transaction.Account,
            condition,
            fulfillment,
          });
        },
      });
    }
  });
}

export async function listenAndCreateAccountSets(
  onSuccess?: (options: {
    playerXrplAddress: string;
    condition: string;
    fulfillment: string;
  }) => Promise<unknown> | unknown
) {
  await xrplClient.generateFaucetWallet();

  xrplClient.subscribeToAccountTransactions(
    {
      accounts: [BANK_ADDRESS],
    },
    async (event: any) => {
      const { playerXrplAddress, condition, fulfillment } =
        await onAccountTransaction(event);

      if (onSuccess) {
        return onSuccess({ playerXrplAddress, condition, fulfillment });
      }
    }
  );
}
