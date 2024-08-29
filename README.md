# Telegram Bot with Google Generative AI Integration

This project is a Telegram bot that integrates with Google Generative AI to process text, images messages. The bot uses the `node-telegram-bot-api` library to interact with Telegram and `@google/generative-ai` to generate AI responses.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Installation](#installation)
- [Running the Bot](#running-the-bot)
- [Usage](#usage)
- [Features](#features)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you start, make sure you have the following:
- Node.js installed (v14 or above)
- A Telegram bot token from the [BotFather](https://core.telegram.org/bots#botfather)
- Google API key with access to Google Generative AI

## Setup

### Step 1: Create a Telegram Bot

1. Open the Telegram app and search for the [BotFather](https://core.telegram.org/bots#botfather).
2. Start a chat with BotFather and send the command `/newbot`.
3. Follow the instructions to create your bot and receive your bot token.

### Step 2: Get Google API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project.
3. Go to the "APIs & Services" section and enable the "Google Generative AI" API.
4. Generate an API key and note it down.

### Step 3: Clone the Repository

Clone the repository to your local machine:

\`\`\`bash
git clone https://github.com/your-username/telegram-bot-generative-ai.git
cd telegram-bot-generative-ai
\`\`\`

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory of the project and add your Telegram bot token and Google API key:

\`env
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
API_KEY=your-google-api-key
\`

Replace \`your-telegram-bot-token\` and \`your-google-api-key\` with the actual values you obtained from BotFather and Google.

## Installation

### Step 1: Install Dependencies

Run the following command to install the required packages:

\`bash
npm install
\`

### Step 2: Install TypeScript (if not already installed)

If you're using TypeScript and it isn't already installed globally, run:

\`bash
npm install -g typescript
\`

## Running the Bot

### Step 1: Compile TypeScript to JavaScript

If you're using TypeScript, compile the TypeScript files to JavaScript:

\`bash
tsc
\`

### Step 2: Start the Bot

Run the following command to start the bot:

\`bash
node dist/index.js
\`

Make sure to replace \`dist/index.js\` with the actual path to your compiled JavaScript file.



## Contributing

Feel free to submit issues and pull requests for new features, improvements, and bug fixes.
