import * as d3 from 'd3-ease';

export default class Logo extends React.Component {
  constructor() {
    super();

    this.defaultDuration = 300;
    this.defaultLineWidth = 10;
    this.currentPosition = null;
    this.transition = {};
  }

  // Helpers

  offsetToAngle(offset) {
    return 2 * Math.PI * offset;
  }

  timeToOffset(hours, minutes, seconds) {
    return (hours % 12)/12 + minutes/12/60 + seconds/12/60/60;
  }

  timeToPosition(hours, minutes, seconds) {
    var hoursOffset = this.timeToOffset(hours, minutes, seconds);
    var minutesOffset = this.timeToOffset(0, minutes, seconds) * 12;

    if (minutesOffset < hoursOffset) {
      minutesOffset += 1;
    }

    var length = minutesOffset - hoursOffset;
    var center = hoursOffset + length / 2;

    if (center > 1) {
      center -= 1;
    }

    return { center, length };
  }

  // Positions

  get nowPosition() {
    const now = new Date();
    return this.timeToPosition(now.getHours(), now.getMinutes(), now.getSeconds());
  }

  get logoPosition() {
    return { center: 0.75, length: 0.72 };
  }

  // Drawing

  draw(position) {
    if (!this.canvas) {
      console.error('Missing <canvas> to draw in');
      return;
    }

    this.currentPosition = position;

    const ratio = window.devicePixelRatio
    const canvas = this.canvas;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    ctx.lineWidth = (this.props.lineWidth || this.defaultLineWidth) * ratio;

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width/2, height/2);
    var diameter = Math.min(width, height);
    ctx.rotate(-Math.PI/2 + this.offsetToAngle(position.center));

    // ctx.beginPath();
    // ctx.arc(0, 0, (diameter - ctx.lineWidth) / 2, 0, 2 * Math.PI);
    // ctx.strokeStyle = '#111';
    // ctx.stroke();

    var startAngle = -1 * this.offsetToAngle(position.length/2);
    var endAngle = this.offsetToAngle(position.length/2);

    ctx.beginPath();
    ctx.arc(0, 0, (diameter - ctx.lineWidth) / 2, startAngle, endAngle);
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.restore();
  }

  // Transition

  transitionTo(newEndPosition, doneCb) {
    if (!this.currentPosition) {
      this.draw(newEndPosition);
      return doneCb && doneCb();
    }

    const now = Date.now();
    const transition = this.transition;

    if (newEndPosition) {
        // New transition
        transition.from = this.currentPosition;
        transition.to = newEndPosition;

        // New end callback
        transition.cb = doneCb;

        let centerDiff = transition.to.center - transition.from.center;
        if (centerDiff < -0.5) {
          centerDiff += 1;
        }
        else if (centerDiff > 0.5) {
          centerDiff -= 1;
        }

        transition.diff = {
          center: centerDiff,
          length: transition.to.length - transition.from.length,
        };

        transition.at = now;
        const duration = this.props.duration || this.defaultDuration;
        transition.for = Math.max(Math.abs(transition.diff.length), Math.abs(transition.diff.center) * 2) * duration;
    }

      // How far are we in the transition?
      let progress = Math.max(0, Math.min((now - transition.at) / transition.for, 1));
      progress = d3.easeCircleOut(progress);

      const newPosition = {
        center: transition.from.center + transition.diff.center * progress,
        length: transition.from.length + transition.diff.length * progress,
      };

      this.draw(newPosition);
      if (progress < 1) {
        window.requestAnimationFrame(this.transitionTo.bind(this, null, null));
      }
      else if (transition.cb) {
        const cb = transition.cb;
        delete transition.cb;
        cb();
      }
  }

  transitionToNow() {
    this.transitionTo(this.nowPosition, () => {
      this.drawInterval = setInterval(() => {
        this.draw(this.nowPosition);
      }, 5 * 1000);
    });
  }

  transitionToLogo() {
    clearInterval(this.drawInterval);
    this.transitionTo(this.logoPosition);
  }

  // Mounting

  componentDidMount() {
    window.canv = this.canvas
    this.transitionToNow();
  }

  // Rendering

  render() {
    return (
      <canvas ref={c => this.canvas = c} />
    );
  }
};
