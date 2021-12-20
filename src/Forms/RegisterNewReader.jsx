//@flow

import * as React from "react";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";
import TextInput from "../components/TextInput/TextInput.jsx";
import Select from "../components/Select/Select.jsx";
import Link from "../components/Link/Link.jsx";

class RegisterNewReader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      readerCode: null,
      readerLabel: null,
      readerLocationId: null
    };
  }

  componentDidMount() {
    this.props.listLocations().then(locations => {
      this.setState({
        locations,
        readerLocationId: locations.length >= 1 ? locations[0].id : null
      });
    });
  }

  onChangeReaderCode = str => {
    this.setState({ readerCode: str });
  };

  onChangeReaderLabel = str => {
    this.setState({ readerLabel: str });
  };

  onChangeReaderLocationId = str => {
    this.setState({ readerLocationId: str });
  };

  onSubmitRegister = event => {
    event.preventDefault();
    const { readerCode, readerLabel, readerLocationId } = this.state;
    this.props.onSubmitRegister(readerLabel, readerCode, readerLocationId);
  };

  render() {
    const { readerCode, readerLabel, locations, readerLocationId } = this.state;
    const { onClickCancel } = this.props;
    return (
      <Section>
        <form onSubmit={this.onSubmitRegister}>
          <Group direction="column" spacing={16}>
            <Group direction="column" spacing={8}>
              <Text size={16} color="dark">
                Register new reader
              </Text>
              <Text size={12} color="lightGrey">
                Enter the key sequence 0-7-1-3-9 on the reader to display its
                unique registration code.
              </Text>
            </Group>
            <Group direction="column" spacing={8}>
              <Text size={14} color="darkGrey">
                Registration code
              </Text>
              <TextInput
                placeholder="quick-brown-fox"
                value={readerCode}
                onChange={this.onChangeReaderCode}
                ariaLabel="Registration code"
              />
              <Text size={14} color="darkGrey">
                Reader label
              </Text>
              <TextInput
                placeholder="Front desk"
                value={readerLabel}
                onChange={this.onChangeReaderLabel}
                ariaLabel="Reader label"
              />
              <Text size={14} color="darkGrey">
                Reader location
              </Text>
              {locations.length === 0 ? (
                <Text size={12} color="lightGrey">
                  Looks like you don't have any locations yet. Start by creating
                  one in {" "}
                  <Link
                    size={12}
                    href="https://dashboard.stripe.com/terminal/locations"
                    text="the dashboard"
                  />
                  .
                </Text>
              ) : (
                <Group direction="column" spacing={1}>
                  <Select
                    items={locations.map(location => ({
                      value: location.id,
                      label: `${location.display_name} (${location.id})`
                    }))}
                    value={readerLocationId}
                    onChange={this.onChangeReaderLocationId}
                    ariaLabel="Reader location"
                    required
                  />
                  <Text size={10} color="lightGrey">
                    You can create more Locations in{" "}
                    <Link
                      size={10}
                      href="https://dashboard.stripe.com/terminal/locations"
                      text="the dashboard"
                    />
                    .
                  </Text>
                </Group>
              )}
            </Group>
            <Group direction="row" alignment={{ justifyContent: "flex-end" }}>
              <Button color="white" onClick={onClickCancel}>
                <Text color="darkGrey" size={14}>
                  Cancel
                </Text>
              </Button>
              <Button
                type="submit"
                disabled={
                  readerCode === null ||
                  readerCode === "" ||
                  readerLabel === null ||
                  readerCode === ""
                }
                color="primary"
              >
                <Text color="white" size={14}>
                  Register
                </Text>
              </Button>
            </Group>
          </Group>
        </form>
      </Section>
    );
  }
}

export default RegisterNewReader;
