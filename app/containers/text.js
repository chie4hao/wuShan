import React, { Component } from 'react';
import { connect } from 'react-redux';

class Text extends Component {
  render() {
    const { dispatch } = this.props;
    return (
      <div>
        <div>{this.props.aa}</div>
        <button onClick={() => dispatch({ type: 'setFilter' })}>sldkfj</button>
      </div>
    );
  }
}

function select(state) {
  return {
    aa: state.show
  };
}
export default connect(select)(Text);
