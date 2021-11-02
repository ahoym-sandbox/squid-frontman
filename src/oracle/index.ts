import { xrplClient } from '../XrplApiSandbox';
import {
  createAccountSet,
  createAccountSetDataWithMeta,
} from './createAccountSet';
import { createConditionAndFulfillment } from './utilities';

const BANK_ADDRESS = 'rDKbcVEGucHNk2em68BSKJjwVQPgYtUJMo';

function onAccountTransaction(event: any) {
  const transaction = event.transaction;

  if (transaction && transaction.TransactionType === 'Payment') {
    console.log('Logged payment to BANK_ADDRESS');

    const [condition] = createConditionAndFulfillment();

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
    });
  }
}

xrplClient.subscribeToAccountTransactions(
  {
    accounts: [BANK_ADDRESS],
  },
  onAccountTransaction
);
