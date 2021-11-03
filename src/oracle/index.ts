import { xrplClient } from '../XrplApiSandbox';
import {
  createAccountSet,
  createAccountSetDataWithMeta,
} from './createAccountSet';
import { createConditionAndFulfillment } from './utilities';

const BANK_ADDRESS = 'rDKbcVEGucHNk2em68BSKJjwVQPgYtUJMo';

function onAccountSetCreationSuccess(
  playerXrplAddress: string,
  condition: string,
  fulfillment: string
) {
  console.log('yayaya playerXrplAddress', playerXrplAddress);
  console.log('yayaya condition', condition);
  console.log('yayaya fulfillment', fulfillment);
}

function onAccountTransaction(event: any) {
  const transaction = event.transaction;

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
      onSuccess: () =>
        onAccountSetCreationSuccess(
          transaction.Account,
          condition,
          fulfillment
        ),
    });
  }
}

xrplClient.generateFaucetWallet().then(() =>
  xrplClient.subscribeToAccountTransactions(
    {
      accounts: [BANK_ADDRESS],
    },
    onAccountTransaction
  )
);
