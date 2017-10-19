import ClassNames from 'classnames';

export default class Link extends React.Component {
  onClick(e) {
    const {href} = this.props;

    if (href.startsWith('http') || href.startsWith('//')) {
      return;
    }

    e.preventDefault();
    app.router.navigateTo(href);
  }

  render() {
    const {href} = this.props;
    return (
      <a
        className={ClassNames(this.props.className, {current: app.router.isCurrent(href)})}
        href={href}
        onClick={this.onClick.bind(this)}
      >
        {this.props.children}
      </a>
    );
  }
};
