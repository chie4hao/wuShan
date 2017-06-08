import React, { Component } from 'react';

export default class Text extends Component {
  props: {
    dispatch: () => void,
    aa: string
  };

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
