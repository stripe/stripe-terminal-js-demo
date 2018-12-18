// Client for the example terminal backend: https://github.com/stripe/example-terminal-backend-stdlib

class Client {
  constructor(url) {
    this.url = url;
  }

  createConnectionToken() {
    return this.doPost(this.url + "/connection_token");
  }

  registerDevice({ label, registrationCode }) {
    return this.doPost(this.url + "/register_reader", {
      label,
      registration_code: registrationCode
    });
  }

  createPaymentIntent(params) {
    return this.doPost(this.url + "/create_payment_intent", params);
  }

  capturePaymentIntent({ paymentIntentId }) {
    return this.doPost(this.url + "/capture_payment_intent", {
      payment_intent_id: paymentIntentId
    });
  }

  saveSourceToCustomer({ sourceId }) {
    return this.doPost(this.url + "/save_card_to_customer", {
      card_present_source_id: sourceId
    });
  }

  async doPost(url, body) {
    let response = await fetch(`${url}/`, {
      // trailing slash is needed for stdlib CORS
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      redirect: "follow",
      body: JSON.stringify(body)
    });

    if (response.ok) {
      return response.json();
    } else {
      let text = await response.text();
      throw new Error("Request Failed: " + text);
    }
  }
}

export default Client;
