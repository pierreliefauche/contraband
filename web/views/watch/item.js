import BaseView from 'views/_base';

export default class WatchItem extends BaseView {
  render() {
    const { watch } = this.props;
    return (
      <a href={watch.url} target="_blank" className='watch'>
        <h3>{watch.title}</h3>
      </a>
    );
  }
};
