# Stripe Terminal JS <img src="https://img.shields.io/badge/Beta-brightgreen.svg">

[Request a Beta invite](https://stripe.com/terminal#request-invite) to get started with Stripe Terminal.

## Try the example app
To help you get up and running even faster, we have developed an example app for the JS SDK in React.

The JS example app shows how to create a page that supports:
- Registering and connecting to new devices
- Discovering and connecting to previously registered devices
- Controlling the reader UI and setting line items on the display
- Collecting card present payments
- Saving a card presented in store to a customer object so it can be used for subscriptions and other recurring billing

To get the example app running locally follow these steps:
1. First clone and deploy the example backend with heroku:
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
(More details about the example backend can be found at [the example backend github page](https://github.com/stripe/example-terminal-backend))

2. Clone this repo and then run the following commands in the root of the directory:
```
cd terminal-demo-app
npm install
npm run start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the example in the browser.

4. In the Backend URL form, enter the heroku URL generated in step 1.

## Documentation
- [Getting Started](https://stripe.com/docs/terminal/js)
- [API Reference](https://stripe.com/docs/terminal/js/reference)
