import BaseView from 'views/_base';
import WatchItem from 'views/watch/item';
import InfiniteScroll from 'react-infinite-scroller';

export default class WatchList extends BaseView {
  render() {
    const { watches } = this.props

    return (
      <div className="watches">
        <h2>Watches</h2>
        <InfiniteScroll
          hasMore={watches.hasNextPage()}
          loadMore={watches.fetchNextPage.bind(watches)}
          initialLoad={false}
          loader={<div className="loader">Loading ...</div>}
          useWindow={true}>
          {watches.map(watch => {
            return <WatchItem key={watch.id} watch={watch}/>;
          })}
        </InfiniteScroll>
      </div>
    );
  }
};
