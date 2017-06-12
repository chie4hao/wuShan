const rootReducer = function rootReducer(state = { show: 'showAll' }, action) {
  switch (action.type) {
    case 'setFilter':
      return { show: state.show + 1 };
    default:
      return state;
  }
};

export default rootReducer;
