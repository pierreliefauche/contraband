import BaseView from 'views/_base';
import imageResizer from 'helpers/image-resizer';
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

  getImageUrl(url) {
    if (!url) {
      return url;
    }

    return imageResizer(url, Math.ceil(250 * window.devicePixelRatio), Math.ceil(250 * 1.2* window.devicePixelRatio));
  }

  render() {
    const { watch, user } = this.props;
    const classnames = classNames('watch', {
      sold: watch.sold,
      'has-price': watch.price,
      'favorited': user.hasFavorited(watch),
      'new': !user.hasSeen(watch),
      [`dealer--${watch.dealerId.replace(/[^a-z0-9]/gi, '_')}`]: true,
      [`brand--${(watch.brandId || '').replace(/[^a-z0-9]/gi, '_')}`]: watch.brandId,
    });

    return (
      <article  className={classnames}>
        <a href={watch.dealerUrl} target="_blank" className="images">
          <div className="image primary" style={{backgroundImage: `url(${this.getImageUrl(watch.primaryImageUrl)})`}}></div>
          {watch.secondaryImageUrl ? <div className="image secondary" style={{backgroundImage: `url(${this.getImageUrl(watch.secondaryImageUrl)})`}}></div> : undefined}
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
