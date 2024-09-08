const {
  RequestNetwork,
  Types,
  Utils,
} = require("@requestnetwork/request-client.js");
const {
  EthereumPrivateKeySignatureProvider,
} = require("@requestnetwork/epk-signature");
const { config } = require("dotenv");
const { Wallet } = require("ethers");

// Load environment variables from .env file
config();

async function createRequest(payerIdentity, expectedAmount, reason, dueDate) {
  const epkSignatureProvider = new EthereumPrivateKeySignatureProvider({
    method: Types.Signature.METHOD.ECDSA,
    privateKey: process.env.PAYEE_PRIVATE_KEY, // Must include 0x prefix
  });

  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://sepolia.gateway.request.network/",
    },
    signatureProvider: epkSignatureProvider,
  });

  const payeeIdentity = new Wallet(process.env.PAYEE_PRIVATE_KEY).address;
  const paymentRecipient = payeeIdentity;
  const feeRecipient = "0x0000000000000000000000000000000000000000";

  const requestCreateParameters = {
    requestInfo: {
      currency: {
        type: Types.RequestLogic.CURRENCY.ERC20,
        value: "0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C",
        network: "sepolia",
      },
      expectedAmount: expectedAmount,
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
      },
      timestamp: Utils.getCurrentTimestampInSecond(),
    },
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: "sepolia",
        paymentAddress: paymentRecipient,
        feeAddress: feeRecipient,
        feeAmount: "0",
      },
    },
    contentData: {
      reason: reason,
      dueDate: dueDate,
    },
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payeeIdentity,
    },
  };

  const request = await requestClient.createRequest(requestCreateParameters);
  const requestData = await request.waitForConfirmation();
  return requestData;
}

module.exports = createRequest;