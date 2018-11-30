# Stripe Terminal JS <img src="https://img.shields.io/badge/Beta-brightgreen.svg">

[Request a Beta invite](https://stripe.com/terminal#request-invite) to get started with Stripe Terminal.

## Try the example app
The JS SDK includes an open-source example app in React, which you can use to familiarize yourself with the SDK and reader before starting your own integration. The SDK comes with a simple reader simulator, so you can get started without any physical hardware.

The example app supports:
- Registering and connecting to a new reader
- Discovering and connecting to a previously registered reader
- Setting line items on the reader display
- Collecting card payments
- Saving a card presented in store to a [Customer](https://stripe.com/docs/api/customers), so it can be used for subscriptions and other recurring billing

To set up and run the example app locally, you'll need to:
1. Navigate to our [example backend](https://github.com/stripe/example-terminal-backend) and click the button to deploy it on Heroku.

2. Navigate to the `terminal-demo-app` folder, and run the following commands. This will run the example app locally and open it in your browser.
```
npm install
npm run start
```

4. In the Backend URL form, enter the URL of the Heroku app you deployed in in step 1.

You can now play around with the example app, which includes a logs panel that shows whats happening behind the scenes.

## Documentation
- [Getting Started](https://stripe.com/docs/terminal/js)
- [API Reference](https://stripe.com/docs/terminal/js/reference)
