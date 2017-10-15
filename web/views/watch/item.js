import BaseView from 'views/_base';

export default class WatchItem extends BaseView {
  render() {
    const { watch } = this.props;
    return (
      <a href={watch.url} target="_blank" className="watch">
        <div className="images">
          <div className="image" style={{'background-image': `url(${watch.primaryImageUrl})`}}></div>
          {watch.secondaryImageUrl ? <div className="image secondary" style={{'background-image': `url(${watch.secondaryImageUrl})`}}></div> : undefined}
        </div>
        <h3>{watch.title}</h3>
      </a>
    );
  }
};
