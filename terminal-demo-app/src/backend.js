class Backend {
    constructor(url) {
        this.url = url;
    }
    
    createConnectionToken() {
      return fetch(this.url + "/connection_token", {method: 'post'})
    }
  
    registerDevice(label, registrationCode) {
      return fetch(this.url + "/register_reader", 
        {
            method: 'post',
            body: {
                label,
                registration_code: registrationCode
            }
        })      
    }
  
    createPaymentIntent(amount, currency, description) {
      return fetch(this.url + "/capture_payment_intent", 
        {
            method: 'post',
            body: {
                amount,
                currency,
                description
            }
        })      
    }

    capturePaymentIntent(paymentIntentId) {
        return fetch(this.url + "/create_payment_intent", 
          {
              method: 'post',
              body: {
                payment_intent_id: paymentIntentId
              }
          })      
      }      
  }
  
  export default Backend;
  