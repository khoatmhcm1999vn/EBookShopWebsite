import React, { Component } from "react"
import Slider from "../components/slider/slider"

class SliderContainer extends Component {
  render() {
    return (
      <Slider
        activateHome={this.props.activateHome}
        activateSupport={this.props.activateSupport}
        activateStatistical={this.props.activateStatistical}
      />
    )
  }
}
export default SliderContainer
