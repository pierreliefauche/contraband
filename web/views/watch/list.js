import BaseView from 'views/_base';
import WatchItem from 'views/watch/item';
import InfiniteScroll from 'react-infinite-scroller';

export default class WatchList extends BaseView {
  constructor() {
    super();
    this.fetchNextPage = _.throttle(this.fetchNextPage.bind(this), 3000);
  }

  fetchNextPage() {
    this.props.watches.fetchNextPage();
  }

  render() {
    const { watches, query } = this.props;

    return (
      <InfiniteScroll
        hasMore={watches.hasNextPage()}
        loadMore={this.fetchNextPage.bind(this)}
        initialLoad={false}
        loader={<div className="loader">Loading ...</div>}
        useWindow={true}
        // threshold={700}
        className="watches flex-fill-row absolute-cover">
        {watches.filter(query.filter.bind(query)).map(watch => {
          return <WatchItem key={watch.getId()} watch={watch} user={app.state.user}/>;
        })}
      </InfiniteScroll>
    );
  }
};
