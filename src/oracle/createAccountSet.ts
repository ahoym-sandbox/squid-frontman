import { RippleAPI } from 'ripple-lib';

// ASCII only
export function toHex(s: string) {
  return s
    .split('')
    .map((c) => {
      return ('0' + c.charCodeAt(0).toString(16)).slice(-2);
    })
    .join('')
    .toUpperCase();
}

// Use https://github.com/XRPLF/XRPL-Standards/discussions/37 but with AccountSet
function createBaseAccountSetMetaDataTx(address: string) {
  return Object.assign(
    {},
    {
      TransactionType: 'AccountSet',
      Account: address,
      Fee: '12', // Drops
      // "Sequence": 5,
      SetFlag: 8, // asfDefaultRipple
      // "Memos": [
      //     {
      //         "Memo": {
      //             "MemoType": "687474703a2f2f6578616d706c652e636f6d2f6d656d6f2f67656e65726963",
      //             "MemoData": "72656e74",
      //             "MemoFormat": "abcd"
      //         }
      //     }
      // ],
    }
  );
}

interface AccountSetMetadata {
  playerXrplAddress: string;
  senderXrplAddress: string;
  condition?: string;
  fulfillment?: string;
  message?: string;
}

export function createAccountSetDataWithMeta(data: AccountSetMetadata) {
  const {
    playerXrplAddress,
    senderXrplAddress,
    condition,
    fulfillment,
    message,
  } = data;
  const newAccountSet = createBaseAccountSetMetaDataTx(
    senderXrplAddress
  ) as any;

  // Save metadata as tx memos
  const memos = [];

  memos.push({
    Memo: {
      MemoData: toHex(playerXrplAddress),
      MemoFormat: toHex('text/plain'),
      MemoType: toHex('nft/0'),
    },
  });

  if (condition) {
    memos.push({
      Memo: {
        MemoData: toHex(condition),
        MemoFormat: toHex('text/plain'),
        MemoType: toHex('nft/1'), // Player
      },
    });
  }
  if (fulfillment) {
    memos.push({
      Memo: {
        MemoData: toHex(fulfillment),
        MemoFormat: toHex('text/plain'),
        MemoType: toHex('nft/2'), // Player
      },
    });
  }

  if (message) {
    memos.push({
      Memo: {
        MemoData: toHex(message),
        MemoFormat: toHex('text/plain'),
        MemoType: toHex('nft/3'), // Condition
      },
    });
  }

  newAccountSet.Memos = memos;

  return newAccountSet;
}

interface CreateAccountSetRequest {
  api: RippleAPI;
  address: string;
  secret: string;
  accountSetMetadataTx: any;
  onSuccess?: (event: any) => void;
}

export async function createAccountSet({
  api,
  address,
  secret,
  accountSetMetadataTx,
  onSuccess,
}: CreateAccountSetRequest) {
  let response = await api.request('account_info', {
    account: address,
    ledger_index: 'current',
    strict: true,
  });

  accountSetMetadataTx.Sequence = response.account_data.Sequence;

  // Sign it
  let signed: any;
  try {
    signed = api.sign(JSON.stringify(accountSetMetadataTx), secret);
  } catch (e: any) {
    console.log('Error signing in createAccountSet');
    console.log(e);
    console.log(e.data);
  }

  // Subscribe
  await api.request('subscribe', {
    accounts: [address],
  });

  api.connection.on('transaction', (event: any) => {
    if (event.transaction.hash === signed.id) {
      console.log('AccountSet successfully validated:', event.transaction.hash);

      if (onSuccess) {
        onSuccess(event);
      }
    }
  });

  // Submit it
  const submitResponse = await api.submit(signed.signedTransaction);
  return submitResponse;
}

// // CTI reference implementation
// // https://github.com/XRPLF/XRPL-Standards/discussions/34
export function cti_encode(
  txn_hash: string /* hex string */,
  txn_index: any,
  ledger_hash: string /* hex string */,
  ledger_index: any
) {
  let ledger_check = BigInt(parseInt(ledger_hash.slice(0, 1), 16));
  let txn_check = BigInt(parseInt(txn_hash.slice(0, 1), 16));
  let cti = (ledger_check << BigInt(4)) + txn_check;
  cti <<= BigInt(16);
  cti += BigInt(txn_index);
  cti <<= BigInt(32);
  cti += BigInt(ledger_index);
  return cti;
}
