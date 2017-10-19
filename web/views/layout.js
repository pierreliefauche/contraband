export default class Layout extends React.Component {
  render() {
    return [
      <nav>
        <h1>contraband</h1>
      </nav>,
      <main>
        {this.props.children}
      </main>
    ];
  }
};
