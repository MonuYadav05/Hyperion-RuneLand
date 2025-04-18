# 🧙‍♂️ Hyperion RuneLand: A Bitcoin-Powered Rune Gaming Adventure

## 🚀 Overview

**Hyperion RuneLand** is a 2D decentralized game that runs on the **Bitcoin blockchain** using the **Runes Protocol**. This project explores how fungible tokens can power real-time game mechanics like character customization, in-game economy, and asset trading — all on **Bitcoin**.

> 🔗 Powered by: Node.js, Next.js, HTML5 Canvas, and the Bitcoin Runes Protocol.

---

## 🎮 Gameplay Highlights

### 🧩 Core Features

- ⚔️ **Real-time gameplay** with character movement and item collection.
- 🪙 **In-game economy** using Rune tokens minted on Bitcoin.
- 🔐 **Wallet integration** with Unisat for minting & transactions.
- 🧠 **Blockchain logic meets game events** – every action can trigger token interactions.
- 🎁 **Popups, battle prompts, feedback loops** – fully interactive!

### 🧬 Game Flow

[Start Game] ↓ [Connect Bitcoin Wallet] ↓ [Collect 50 Gold Coins In-Game] ↓ [Trigger Rune Token Minting] ↓ [Use Rune Tokens for Customization or Trading] ↓ [Transfer Tokens via Wallet] ↓ [Interact, Trade, and Battle!]


---

## ⚙️ Tech Stack

### 🖥️ Frontend

- **Framework**: Next.js (React)
- **Game Engine**: Custom HTML5 Canvas
- **Wallet**: UniSat Wallet (Bitcoin testnet)
- **UI**: TailwindCSS, ShadCN, Framer Motion

### 🛠 Backend

- **Framework**: Node.js with Express
- **Blockchain**: Bitcoin Testnet
- **Rune Protocol Tools**:
  - `runelib`: Etching, minting, transferring Rune tokens.
  - `bitcoinjs-lib`: Transaction handling.
  - `ecpair`: Key generation and signing.
  - `bitcoinerlab`: PSBT workflows, UTXO management.

---

## 🔧 Installation

```bash
# Clone the repo
git clone https://github.com/amsorrytola/Hyperion-RuneLand

#Rune Token serve
cd rune-token-backend
npm i
node server.js

#Etching
cd Etching-Interface
npm i
npm run dev

# Game Server fore multiplayer
cd game-server
npm i
npm start

# Install frontend dependencies
cd game-client
npm install
npm run dev
