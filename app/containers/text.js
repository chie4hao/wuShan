import { connect } from 'react-redux';
import Text from '../components/Text';

function select(state) {
  return {
    aa: state.rootReducer.show
  };
}

export default connect(select)(Text);
