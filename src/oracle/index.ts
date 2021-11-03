import { xrplClient } from '../XrplApiSandbox';
import {
  createAccountSet,
  createAccountSetDataWithMeta,
} from './createAccountSet';
import { createConditionAndFulfillment } from './utilities';

const BANK_ADDRESS = 'rpMzbkZuxApNHJTAETbDB9e68b9XC9CY2C';

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
    (event: any) => {
      return onAccountTransaction(event).then(
        ({ playerXrplAddress, condition, fulfillment }) => {
          if (onSuccess) {
            return onSuccess({ playerXrplAddress, condition, fulfillment });
          }
        }
      );
    }
  );
}

export function publishWinnerFulfillment(
  winnerAddress: string,
  fulfillment: string,
  onSuccess?: (event: any) => any
) {
  const preparedAccountSetTx = createAccountSetDataWithMeta({
    playerXrplAddress: winnerAddress,
    fulfillment,
    senderXrplAddress: xrplClient.wallet()?.account.address!,
  });
  createAccountSet({
    api: xrplClient.api(),
    address: xrplClient.wallet()?.account.address!,
    secret: xrplClient.wallet()?.account.secret!,
    accountSetMetadataTx: preparedAccountSetTx,
    onSuccess: (event: any) => {
      console.log(event);
      if (onSuccess) {
        onSuccess(event);
      }
    },
  });
}
