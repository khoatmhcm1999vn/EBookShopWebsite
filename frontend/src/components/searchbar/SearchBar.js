import React from "react";
// /* global google */

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
  }
  componentDidMount() {
    // this.autocomplete = new google.maps.places.Autocomplete(
    //   this.autocompleteInput.current,
    //   { types: ["geocode"] }
    // );
    this.autocomplete.addListener("place_changed", this.handlePlaceChanged);
  }
  handlePlaceChanged() {
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;
    console.log(addressObject);
    this.props.setAddressLine1(addressObject.name);
    this.props.setWard(address[1].long_name);
    this.props.setDistrict(address[2].long_name);
    this.props.setCity(address[3].long_name);
    // this.props.onPlaceLoaded(addressObject);
  }
  render() {
    // console.log(this.autocompleteInput);
    return (
      <input
        ref={this.autocompleteInput}
        id="autocomplete"
        placeholder="Enter your address"
        type="text"
      ></input>
    );
  }
}
export default SearchBar;
