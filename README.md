# Stripe Terminal JS Demo

👋 [Request an invite](https://stripe.com/terminal#request-invite) to get started with Stripe Terminal.

Use this demo app to familiarize yourself with the Stripe Terminal JS SDK before starting your own integration. 

**You can see this demo app running on [stripe-terminal-demo.appspot.com](https://stripe-terminal-demo.appspot.com)**

To use the demo, you'll need to deploy our example backend. Navigate to our [example backend](https://github.com/stripe/example-terminal-backend), and click the button on the Readme to deploy it for free on Heroku with your Stripe API key.

## Overview

<img src="JSExampleApp_MainPage.gif" alt="Demo" width="610">

This demo features an developer-focused example for integrating with Stripe Terminal on the web: 

<!-- prettier-ignore -->
|     | Features
:---: | :---
✨ | **Reader simulator.** The SDK comes with a reader simulator, so you can get started without any physical hardware.
📖 | **Logs panel.** The demo features a logs panel, which you can refer to as interactive documentation while you're building  your own Terminal integration.
⬆️ | **Register a reader.** Before connecting to a reader for the first time, you'll need to register the device. The demo shows you how to [register a new reader](https://stripe.com/docs/api/terminal/readers/create) to your account using our backend API.
💳 | **Collect a card payment.** You can easily [collect a payment method](https://stripe.com/docs/terminal/js/payment) in-person using the JS SDK and our pre-certified card readers.
🖥 | **Control the reader display.** The demo shows you how to [display line items on your reader](https://stripe.com/docs/terminal/js/workflows#customize-the-display-during-a-payment). The SDK makes it easy to build a dynamic checkout experience where the reader display updates as items are added.
💾 | **Read a card without charging.** You can also use the SDK to [read a card without charging it](https://stripe.com/docs/terminal/js/workflows#read-source), which can be useful to defer a payment for later. However, note that the transaction will not receive the beneficial rates and liability shift associated with card present transactions. Most integrations should not need to use this workflow. Instead, use our [standard integration](https://stripe.com/docs/terminal/js/payment) for collecting a payment.

## Running locally

If you prefer running the example app locally, you can run the following commands:
```
npm install
npm run start
```

