// Client for the example terminal backend: https://github.com/stripe/example-terminal-backend
class Client {
  constructor(url) {
    this.url = url;
    this.listLocations = this.listLocations.bind(this);
  }

  createConnectionToken() {
    const formData = new URLSearchParams();
    return this.doPost(this.url + "/connection_token", formData);
  }

  registerDevice({ label, registrationCode, location }) {
    const formData = new URLSearchParams();
    formData.append("label", label);
    formData.append("registration_code", registrationCode);
    formData.append("location", location);
    return this.doPost(this.url + "/register_reader", formData);
  }

  createPaymentIntent({ amount, currency, description, paymentMethodTypes }) {
    const formData = new URLSearchParams();
    formData.append("amount", amount);
    formData.append("currency", currency);
    formData.append("description", description);
    paymentMethodTypes.forEach((type) => formData.append(`payment_method_types[]`, type));
    return this.doPost(this.url + "/create_payment_intent", formData);
  }

  capturePaymentIntent({ paymentIntentId }) {
    const formData = new URLSearchParams();
    formData.append("payment_intent_id", paymentIntentId);
    return this.doPost(this.url + "/capture_payment_intent", formData);
  }

  savePaymentMethodToCustomer({ paymentMethodId }) {
    const formData = new URLSearchParams();
    formData.append("payment_method_id", paymentMethodId);
    return this.doPost(this.url + "/attach_payment_method_to_customer", formData);
  }

  async listLocations() {
    const response = await fetch(this.url + "/list_locations", {
      method: "get",
    });

    if (response.ok) {
      return response.json();
    } else {
      let text = await response.text();
      throw new Error("Request Failed: " + text);
    }
  }

  async doPost(url, body) {
    let response = await fetch(url, {
      method: "post",
      body: body,
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
