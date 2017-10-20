import Link from 'components/link';
import Logo from 'views/logo';

export default class Layout extends React.Component {
  render() {
    return [
      <nav key="nav" onMouseEnter={() => this.logo.transitionToLogo()}  onMouseLeave={() => this.logo.transitionToNow()}>
        <Logo ref={l => this.logo = l} duration={700} lineWidth={12} />
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
