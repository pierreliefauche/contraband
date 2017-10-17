import BaseView from 'views/_base';
import WatchItem from 'views/watch/item';
import InfiniteScroll from 'react-infinite-scroller';

export default class WatchList extends BaseView {
  render() {
    const { watches } = this.props

    return (
      <div className="watches absolute-cover">
        <h2>C O N T R A B A N D</h2>
        <InfiniteScroll
          hasMore={watches.hasNextPage()}
          loadMore={watches.fetchNextPage.bind(watches)}
          initialLoad={false}
          loader={<div className="loader">Loading ...</div>}
          useWindow={true}
          // threshold={700}
          className="list flex-fill-row absolute-cover">
          {watches.map(watch => {
            return <WatchItem key={watch.getId()} watch={watch}/>;
          })}
        </InfiniteScroll>
      </div>
    );
  }
};
