import { BANK_ADDRESS, xrplClient } from '../XrplApiSandbox';
import {
  createAccountSet,
  createAccountSetDataWithMeta,
} from './createAccountSet';
import { createConditionAndFulfillment } from './utilities';

function onAccountTransaction(event: any): Promise<{
  event: any;
  playerXrplAddress: string;
  condition: string;
  fulfillment: string;
}> {
  const transaction = event.transaction;

  return new Promise((resolve) => {
    if (transaction && transaction.TransactionType === 'Payment') {
      console.log('A payment was logged to the Piggy bank.', transaction);
      const [condition, fulfillment] = createConditionAndFulfillment();

      const preparedAccountSetTx = createAccountSetDataWithMeta({
        playerXrplAddress: transaction.Account,
        condition,
        senderXrplAddress: xrplClient.wallet()?.account.address!,
      });
      return createAccountSet({
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

export async function publishWinnerFulfillment(
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
      if (onSuccess) {
        onSuccess(event);
      }
    },
  });
}

export function publishMessage(
  message: string,
  onSuccess?: (event: any) => any
) {
  return xrplClient.generateFaucetWallet().then(() => {
    const preparedAccountSetTx = createAccountSetDataWithMeta({
      message,
      senderXrplAddress: xrplClient.wallet()?.account.address!,
    });
    createAccountSet({
      api: xrplClient.api(),
      address: xrplClient.wallet()?.account.address!,
      secret: xrplClient.wallet()?.account.secret!,
      accountSetMetadataTx: preparedAccountSetTx,
      onSuccess: (event: any) => {
        if (onSuccess) {
          onSuccess(event);
        }
      },
    });
  });
}

(window as any).publishMessage = publishMessage;
