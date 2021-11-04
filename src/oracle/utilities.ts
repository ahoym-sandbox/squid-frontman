import crypto from 'crypto';
import cc from 'five-bells-condition'; // types declared as any in react-app-env.d.ts, only put it there for convenience

// https://xrpl.org/send-a-conditionally-held-escrow.html#1-generate-condition-and-fulfillment
export function createConditionAndFulfillment() {
  const preimageData = crypto.randomBytes(32);
  const myFulfillment = new cc.PreimageSha256();
  myFulfillment.setPreimage(preimageData);

  const condition = myFulfillment
    .getConditionBinary()
    .toString('hex')
    .toUpperCase();

  // keep secret until you want to finish executing the held payment:
  const fulfillment = myFulfillment
    .serializeBinary()
    .toString('hex')
    .toUpperCase();
  return [condition, fulfillment];
}
