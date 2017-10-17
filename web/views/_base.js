import Events from 'ampersand-events';

const deferbounce = function(fn) {
  let triggered = false;
  return function() {
    if (!triggered) {
      triggered = true;
      setTimeout(() => {
        fn.call(this);
        triggered = false;
      }, 0);
    }
  }
};

class BaseView extends React.Component {
  componentDidMount() {
    if (this.autoWatch !== false) {
      Object.keys(this.props).forEach(k => {
        this.listenToState(this.props[k]);
      });
    }
  }

  componentWillUnmount() {
    this.stopListening();
  }

  listenToState(modelOrCollection) {
    let events;

    if (modelOrCollection != null && typeof modelOrCollection === 'object'){
      if (modelOrCollection.isCollection) {
        events = 'add remove reset sort';
      }
      else if (modelOrCollection.isState) {
        events = 'change';
      }
    }

    if (!events){
      return;
    }

    this.listenTo(modelOrCollection, events, deferbounce(this.forceUpdate.bind(this)));
  }
};

_.assign(BaseView.prototype, Events);

export default BaseView;
