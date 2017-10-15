import BaseView from 'views/_base';
import WatchItem from 'views/watch/item';

export default class WatchList extends BaseView {
  render() {
    const { watches } = this.props

    return (
      <div>
        <h2>Watches</h2>
        <div>
          {watches.map(watch => {
            return <WatchItem key={watch.id} watch={watch}/>;
          })}
        </div>
        {watches.hasNextPage() ? <button onClick={watches.fetchNextPage.bind(watches)}>Load More</button> : undefined}
      </div>
    );
  }
};
