# Stripe Terminal JS Example App

👋 [Request an invite](https://stripe.com/terminal#request-invite) to get started with Stripe Terminal.

This demo features an example point of sale built with React, which you can use to familiarize yourself with the SDK and reader before starting your own integration. 

**You can see this demo app running on [stripe-payments-demo.appspot.com](https://stripe-terminal-demo.appspot.com)**

To use this demo, you'll need to navigate to our [example backend](https://github.com/stripe/example-terminal-backend) and click the button to deploy it on Heroku using your Stripe API key.

## Overview

<img src="JSExampleApp-MainPage.png" alt="Demo" width="610">

This demo features an developer-focused example for integrating with Stripe Terminal on the web. 

<!-- prettier-ignore -->
|     | Features
:---: | :---
✨ | **Reader simulator.** The Terminal SDK comes with a reader simulator, so you can get started without any physical hardware.
📖 | **Logs panel.** The demo features a logs panel, which you can refer to as interactive documentation while you're building  your own Terminal integration.
⬆️ | **Register a reader.** The app shows you how to [register a new reader](https://stripe.com/docs/api/terminal/readers/create) to your account using our backend API.
🖥 | **Control the reader display.** The app includes a workflow for [displaying line items on your reader](https://stripe.com/docs/terminal/js/workflows#customize-the-display-during-a-payment).
💳 | **Collect a card payment.** You can easily [collect a payment method](https://stripe.com/docs/terminal/js/payment) in-person using the JS SDK.
💾 | **Read a card without charging.** You can use the SDK to [read a card without charging it](https://stripe.com/docs/terminal/js/workflows#read-source), e.g. to defer payment for later.

## Running locally

Run the following commands to run the example app locally and open it in your browser.
```
npm install
npm run start
```

