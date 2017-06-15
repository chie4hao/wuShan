import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class Text extends Component {
  props: {
    dispatch: () => void,
    aa: string
  };

  render() {
    const { dispatch } = this.props;
    return (
      <div>
        <div>{this.props.aa}</div>
        <RaisedButton onClick={() => dispatch({ type: 'setFilter' })} label={'Add'} />
      </div>
    );
  }
}

export default Text;
