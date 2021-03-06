# EOSDT JS

A JavaScript library to execute EOSDT contracts methods.

## Usage

Install the module using NPM:

```bash
$ npm install @eosdt/eosdt-js-legacy
```

Use service module `Connector` to initiate one of four functional modules (`Positions`, `Governance`, `Liquidator` or `Balances`). `Connector` requires address of node that would process transactions and an array of private keys, used to sign transactions.

```Javascript
const { EosdtConnector } = require("@eosdt/eosdt-js-legacy")

const nodeAddress = "http://node-address.example.com:80"

const connector = new EosdtConnector(nodeAddress, ["private-key-1", "private-key-2"])
-legacy
const positions = connector.getPositions()
const governance = connector.getGovernance()
const liquidator = connector.getLiquidator()
const balances = connector.getBalances()
```

## Modules

### Connector

Creates a connector object, used to initiate functional modules and invoke their methods.

### Positions

Module to manage EOSDT positions. Methods:

-   `create` - creates new position, using specified amount of EOS as collateral and issuing specified amount of EOSDT to creator.
-   `close` - used to close a position in event of a global shutdown.
-   `del` - deletes position that has 0 debt.
-   `give` - transfers position ownership to another account
-   `addCollateral` - sends EOS to position to increase it's collateralization.
-   `deleteCollateral` - returns specified part of used collateral to user if LTV stays above critical.
-   `generateDebt` - issues additional EOSDT for position if this does not bring LTV below critical.
-   `burnbackDebt` - repays specified amount of EOSDT decreasing debt.
-   `marginCall` - called on a position with critical LTV, to perform a margin call.
-   `getContractEosAmount` - returns eosdtcntract EOS balance
-   `getRates` - returns table of current system token prices (rates).
-   `getPositionById` - returns a position object, selecting it by id.
-   `getAllUserPositions` - returns an array of all positions for specified user (up to 100 positions).
-   `getParameters` - returns Positions contract parameters.
-   `getSettings` - return Positions contract settings.

### Governance

Governance methods help manage the system: create proposals to change system parameters, vote on them and stake NUT tokens for voting. Methods:

-   `stake` - sends NUT tokens to contract, staking them and allowing to vote on proposals.
-   `unstake` - unstakes NUT tokens, returning them to user and lowering amount of available votes.
-   `getSettings` - returns governance contract settings.
-   `getVotes` - returns an array with all votes (up to 1000).
-   `getVoterInfo` - returns amount of staked EOS and unstake date for specified voter.
-   `voteForBlockProducers` - voting with staked NUTs for specified block producers.
-   `getBpVotes` - returns array of block producers names and amount of NUT votes for them.
-   `getProxyVotes` - returns an info on block producers the proxy is currently voting for.

### Balances

Module to get user's balances of EOSDT, EOS and NUT. Methods:

-   `getNut` - returns NUT balance of account
-   `getEosdt` - returns EOSDT balance of account
-   `getEos` - returns EOS balance of account

## Examples

You can find working example scripts in module directory `examples`.

### Connecting to blockchain

This code block is required for any other example to work.

```Javascript
const { EosdtConnector } = require("@eosdt/eosdt-js-legacy")

// Change node address here. This one will connect you to Jungle testnet node
const nodeAddress = "http://jungle2.cryptolions.io:80"

// Change or add private keys used to sign transactions here. This one is from Jungle
// testnet account "exampleaccnt"
const privateKeys = ["5JEVy6QujTsFzxWtBbQrG53vkszRybabE4wSyA2Tg1uZFEeVPks"]
const accountName = "exampleaccnt"

const connector = new EosdtConnector(nodeAddress, privateKeys)

// This code logs current block number and lets us know that connection
// has been  established.
const currentBlockNumber = (await connector.rpc.get_info()).head_block_num
console.log(`Connected to blockchain, current block number is: ${currentBlockNumber}`)

// Getting objects with all methods
const positions = connector.getPositions()
const governance = connector.getGovernance()
const liquidator = connector.getLiquidator()
const balances = connector.getBalances()
```

### Position operations

Creating position, adding collateral, issuing addintional debt then returning it, returning collateral from postion and closing it.

```Javascript
// Creating a position to issue 2 EOSDT for 1.5 EOS collateral
// ATTENTION: this will throw if a user already has a position
await positions.create(accountName, 1.5, 2)

// Getting last user position
const allUserPositions = await positions.getAllUserPositions(accountName)
const lastUserPosition = allUserPositions[allUserPositions.length - 1]
const positionId = lastUserPosition.position_id
console.log("Position created:", lastUserPosition)

// Adding 1.6 EOS collateral to position
await positions.addCollateral(accountName, 1.6, positionId)

let updatedPosition = await positions.getPositionById(positionId)
console.log("Position collateral increased: ", updatedPosition)

// Issuing addintional 2.15 EOSDT of debt
await positions.generateDebt(accountName, 2.15, positionId)

updatedPosition = await positions.getPositionById(positionId)
console.log("Position outstanding and governance debts increased: ", updatedPosition)

// Returning 6 EOSDT to Positions contract. All excessive tokens will be returned to
// user. Appropriate amount of NUT tokens will be withdrawn from user balance. User
// required to have NUT tokens to burn debt.
await positions.burnbackDebt(accountName, 6, positionId)

updatedPosition = await positions.getPositionById(positionId)
console.log("Position debt decreased: ", updatedPosition)

// Returning 1.35 EOS of collateral to user (partial collateral return). If there is
// debt still left, user cannot return more collateral than required for position
// to have LTV above critical
await positions.deleteCollateral(accountName, 1.35, positionId)

updatedPosition = await positions.getPositionById(positionId)
console.log("Position collateral decreased: ", updatedPosition)

// Deleting position and returning all collateral to user. Would only work, if
// position has zero debts.
await positions.delete(accountName, positionId)

updatedPosition = await positions.getPositionById(positionId)
console.log("Position deleted, excess EOS returned to user, position must now be undefined: ",
  updatedPosition)
```

### Voting

Staking NUT tokens to vote for and against block producers.

```Javascript
// Transfering 2 NUT tokens to use them in voting. Tokens can be unstaked and
// transferred back after 3 days wait period (votes, using these tokens must be
// cancelled first)
await governance.stake(accountName, 2)

// Unstaking NUT tokens to get them back on user's balance
await governance.unstake(2, accountName)
```

### Balances operations

Gettings balances of EOS, EOSDT or NUT

```Javascript
// Getting amount of EOS available on user's balance
await balances.getEos(accountName)
```
