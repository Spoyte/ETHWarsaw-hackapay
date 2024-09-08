# quickstart-node.js

This repo will introduce the four primary operations provided by Request
Network’s SDK while using the `EthereumPrivateKeySignatureProvider` to sign
requests with a private key that is managed outside of a wallet.

This approach works well for Node.js environments without access to a web3 wallet.

## Setup

Make a .env file

```bash
cp .env.example .env
```

Add the environment variables:

```bash
# Must include 0x prefix
PAYEE_PRIVATE_KEY='***REDACTED***'
PAYER_PRIVATE_KEY='***REDACTED***'

# Infura, Alchemy, etc.
JSON_RPC_PROVIDER_URL='https://eth-sepolia.g.alchemy.com/v2/demo'
```

Install

```bash
npm install
```

## Run

Run the scripts

```bash
npm run retrieve
npm run create
npm run pay
npm run declare
```
