import * as React from "react";

import Button from "../components/Button/Button.jsx";
import Icon from "../components/Icon/Icon.jsx";
import Group from "../components/Group/Group.jsx";
import Link from "../components/Link/Link.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";
import TextInput from "../components/TextInput/TextInput.jsx";
import Select from "../components/Select/Select.jsx";

class CartForm extends React.Component {
  static CURRENCIES = [
    { value: "usd", label: "USD" },
    { value: "gbp", label: "GBP" },
    { value: "cad", label: "CAD" }
  ];

  render() {
    return (
      <>
        <Group direction="column" spacing={0}>
          <Section position="first">
            <Text size={16} color="dark">
              Cart configuration
            </Text>
          </Section>
          <Section position="middle">
            <Group direction="column">
              <Group
                direction="row"
                alignment={{
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Text size={12} color="dark">
                  Item description
                </Text>
                <TextInput
                  value={this.props.itemDescription}
                  onChange={this.props.onChangeItemDescription}
                  ariaLabel="Item description"
                />
              </Group>
              <Group
                direction="row"
                alignment={{
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Text size={12} color="dark">
                  Charge amount
                </Text>
                <TextInput
                  value={this.props.chargeAmount}
                  onChange={this.props.onChangeChargeAmount}
                  ariaLabel="Charge amount"
                />
              </Group>
              <Group
                direction="row"
                alignment={{
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Text size={12} color="dark">
                  Tax amount
                </Text>
                <TextInput
                  value={this.props.taxAmount}
                  onChange={this.props.onChangeTaxAmount}
                  ariaLabel="Tax amount"
                />
              </Group>
              <Group
                direction="row"
                alignment={{
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Text size={12} color="dark">
                  Currency
                </Text>
                <Select
                  items={CartForm.CURRENCIES}
                  value={CartForm.CURRENCIES[0]}
                  onChange={this.props.onChangeCurrency}
                  ariaLabel="Currency"
                />
              </Group>
              <Button
                color="white"
                onClick={this.props.onClickUpdateLineItems}
                disabled={this.props.workFlowDisabled}
                justifyContent="left"
              >
                <Group direction="row">
                  <Icon icon="list" />
                  <Text color="blue" size={14}>
                    Update line items and totals
                  </Text>
                </Group>
              </Button>
            </Group>
          </Section>
          <Section position="last">
            <Text size={12} color="lightGrey">
              Test payment responses{" "}
              <Link
                href="https://stripe.com/docs/terminal/testing"
                text="using amounts"
                newWindow
              />
              .
            </Text>
          </Section>
        </Group>
      </>
    );
  }
}

export default CartForm;
