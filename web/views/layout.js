import Link from 'components/link';

export default class Layout extends React.Component {
  render() {
    return [
      <nav key="nav">
        <h1>contraband</h1>
        <Link href="/">All</Link>
        <Link href="/favorites">👍</Link>
      </nav>,
      <main key="main">
        {this.props.children}
      </main>
    ];
  }
};
