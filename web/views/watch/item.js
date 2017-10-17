import BaseView from 'views/_base';
import classNames from 'classnames';

import app from 'ampersand-app';

export default class WatchItem extends BaseView {
  toggleFavorite(e) {
    e.preventDefault();

    const { watch } = this.props;

    if (watch && watch.favorited) {
      app.state.user.removeFavorite(watch);
    }
    else {
      app.state.user.addFavorite(watch);
    }
  }

  render() {
    const { watch } = this.props;
    return (
      <a href={watch.url} target="_blank" className={classNames('watch', {sold: watch.sold, 'has-price': watch.price, 'favorited': watch.favorited})}>
        <button className={classNames('favorite')} onClick={this.toggleFavorite.bind(this)}>Favorite</button>
        <div className="images">
          <div className="image" style={{backgroundImage: `url(${watch.primaryImageUrl})`}}></div>
          {watch.secondaryImageUrl ? <div className="image secondary" style={{backgroundImage: `url(${watch.secondaryImageUrl})`}}></div> : undefined}
        </div>
        <h3>{watch.title}</h3>
        <span className="price">{watch.priceLabel}</span>
      </a>
    );
  }
};
