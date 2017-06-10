import { connect } from 'react-redux';
import Text from '../components/Text';

function select(state) {
  return {
    aa: state.show
  };
}

export default connect(select)(Text);
