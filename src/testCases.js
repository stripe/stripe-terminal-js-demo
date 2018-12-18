// https://stripe.com/docs/terminal/testing#test-cards
const testCases = {
  approved: { amount: 100, description: "Payment is approved" },
  call_issuer: {
    amount: 101,
    description: "Payment is declined with a call_issuer code"
  },
  generic_decline: {
    amount: 105,
    description: "Payment is declined with a generic_decline code"
  },
  incorrect_pin: {
    amount: 155,
    description: "Payment is declined with an incorrect_pin code"
  },
  withdrawal_count_limit_exceeded: {
    amount: 165,
    description:
      "Payment is declined with a withdrawal_count_limit_exceeded code"
  },
  pin_try_exceeded: {
    amount: 175,
    description: "Payment is declined with a pin_try_exceeded code"
  }
};

export default testCases;
