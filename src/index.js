import './scss/main.scss';

class ShapeOverlays {
  constructor(el) {
    this.el = el; // Parent SVG element.
    this.path = el.querySelectorAll('path'); // Path elements in parent SVG. These are the layers of the overlay.
    this.numPoints = 10; // Number of control points for Bezier Curve.
    this.duration = 900; // Animation duration of one path element.
    this.delayPointsArray = []; // Array of control points for Bezier Curve.
    this.delayPointsMax = 300; // Max of delay value in all control points.
    this.delayPerPath = 250; // Delay value per path.
    this.timeStart = Date.now();
    this.isOpened = false;
    this.isAnimating = false;
  }

  toggle() {
    this.isAnimating = true;
    for (var i = 0; i < this.numPoints; i++) {
      this.delayPointsArray[i] = Math.random() * this.delayPointsMax;
    }
    if (this.isOpened === false) {
      //this.open();
      this.close();
    } else {
      this.close();
    }
  }

  open() {
    this.isOpened = true;
    //this.el.classList.add('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
  }

  close() {
    this.isOpened = false;
    //this.el.classList.remove('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();

    // document.querySelector('#cube').scrollIntoView({	
    //   behavior: 'smooth'	
    // });	
  }

  updatePath(time) {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) {
      points[i] = (1 - ease.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1))) * 100
    }

    let str = '';
    str += (this.isOpened) ? `M 0 0 V ${points[0]}` : `M 0 ${points[0]}`;
    for (var i = 0; i < this.numPoints - 1; i++) {
      const p = (i + 1) / (this.numPoints - 1) * 100;
      const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
    }
    str += (this.isOpened) ? `V 100 H 0` : `V 0 H 0`;
    return str;
  }

  render() {
    if (this.isOpened) {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
      }
    } else {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
      }
    }
  }
  
  renderLoop() {
    this.render();
    if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
    else {
      this.isAnimating = false;
      //this.el.style.top = '-100%';
    }
  }
}




(function() {
  const btn = document.querySelector('.intro__scroll-btn');
  const elOverlay = document.querySelector('.shape-overlays');
  const overlay = new ShapeOverlays(elOverlay);

  btn.addEventListener('click', (e) => {
    //console.log(e.target);
    if (overlay.isAnimating) {
      return false;
    }
    overlay.toggle();
  });
}());




/* easings */ 
const ease = {
  cubicInOut: (t) => {
    return t < 0.5
      ? 4.0 * t * t * t
      : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
  }
};

