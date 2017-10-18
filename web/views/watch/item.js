import BaseView from 'views/_base';
import classNames from 'classnames';

export default class WatchItem extends BaseView {
  toggleFavorite(e) {
    e.preventDefault();

    const { watch, user } = this.props;

    if (watch && user.hasFavorited(watch)) {
      user.removeFavorite(watch);
    }
    else {
      user.addFavorite(watch);
    }
  }

  render() {
    const { watch, user } = this.props;
    const classnames = classNames('watch', {
      sold: watch.sold,
      'has-price': watch.price,
      'favorited': user.hasFavorited(watch),
      'new': user.hasSeen(watch),
      [`dealer--${watch.dealerId.replace(/[^a-z0-9]/gi, '_')}`]: true,
      [`brand--${watch.brandId.replace(/[^a-z0-9]/gi, '_')}`]: true,
    });

    return (
      <article  className={classnames}>
        <a href={watch.dealerUrl} target="_blank" className="images">
          <div className="image" style={{backgroundImage: `url(${watch.primaryImageUrl})`}}></div>
          {watch.secondaryImageUrl ? <div className="image secondary" style={{backgroundImage: `url(${watch.secondaryImageUrl})`}}></div> : undefined}
        </a>
        <h3>{watch.title}</h3>
        <footer>
          <span className="price">{watch.priceLabel}</span>
          <button className={classNames('favorite')} onClick={this.toggleFavorite.bind(this)}></button>
        </footer>
      </article>
    );
  }
};
