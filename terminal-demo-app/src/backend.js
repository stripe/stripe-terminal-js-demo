class Backend {
  constructor(url) {
    this.url = url;
  }

  createConnectionToken() {
    const formData = new URLSearchParams();
    return this.doPost(this.url + "/connection_token", formData);
  }

  registerDevice(label, registrationCode) {
    const formData = new URLSearchParams();
    formData.append('label', label)
    formData.append('registration_code', registrationCode)
    return this.doPost(this.url + "/register_reader", formData);
  }

  createPaymentIntent(amount, currency, description) {
    const formData = new URLSearchParams();
    formData.append('amount', amount)
    formData.append('currency', currency)
    formData.append('description', description)
    return this.doPost(this.url + "/create_payment_intent", formData);
  }

  capturePaymentIntent(paymentIntentId) {
    const formData = new URLSearchParams();
    formData.append('payment_intent_id', paymentIntentId)
    return this.doPost(this.url + "/capture_payment_intent", formData);
  }

  saveSourceToCustomer(sourceId) {
    const formData = new URLSearchParams();
    formData.append('card_present_source_id', sourceId)
    return this.doPost(this.url + "/save_card_to_customer", formData);
  }

  async doPost(url, body) {
    let response = await fetch(url, {
      method: "post",
      body: body
    });

    if (response.ok) {
      return response.json();
    } else {
      console.log(response)
      let text = await response.text();
      throw new Error("Request Failed: " + text);
    }
  }
}

export default Backend;
