import './scss/main.scss';
import * as basicScroll from 'basicscroll';

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
    this.scrollTop = false;
  }

  animate() {
    this.isAnimating = true;
    for (var i = 0; i < this.numPoints; i++) {
      this.delayPointsArray[i] = Math.random() * this.delayPointsMax;
    }
    if (this.scrollTop === false) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpened = true;
    this.timeStart = Date.now();
    this.renderLoop();
  }

  close() {
    this.isOpened = false;
    this.timeStart = Date.now();
    this.renderLoop();
  }

  updatePath(time) {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) {
      points[i] = (1 - ease.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1))) * 100;
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
    this.el.classList.add('is-opened');
    this.render();
    if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    } else {
      this.isAnimating = false;
      this.el.classList.remove('is-opened');
    }
  }
}




(function() {

  /* --- svg animation --- */
  const btn = document.querySelector('.intro__scroll-btn');
  const elOverlay = document.querySelector('.shape-overlays');
  const overlay = new ShapeOverlays(elOverlay);

  btn.addEventListener('click', (e) => {
    if (overlay.isAnimating) {
      return false;
    }
    overlay.animate();
  });
  /* --- end svg animation --- */

  /* --- active menu --- */
  const sectionArr = document.querySelectorAll('.section');
  const sectionObj = {};
  let i = 0;
  const sectionLastID = sectionArr[sectionArr.length-1].id;

  Array.prototype.forEach.call(sectionArr, function(item) {
    sectionObj[item.id] = item.offsetTop;
  });

  window.onscroll = function() {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    for (i in sectionObj) {
      if (sectionObj[i] <= scrollPosition) {        
        document.querySelector('.active').classList.remove('active');
        document.querySelector('a[href*=' + i + ']').classList.add('active');

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          document.querySelector('.active').classList.remove('active');
          document.querySelector('a[href*=' + sectionLastID + ']').classList.add('active');
        }
      }
    }
  };
  /* --- end active menu --- */

  /* --- email letter hover --- */
  function toArray(arr) { 
    return Array.isArray(arr) ? arr : Array.from(arr);
  }
  
  function makeSpans(selector) {
    const elArr = document.querySelectorAll(selector);
    const elArr2 = toArray(elArr);
    const elements = elArr2.slice(0);
    
    return elements.map(function (element) {
      const text = element.innerText.split('');
      const spans = text.map(function (letter) {
        return '<span>' + letter + '</span>'
      }).join('');
      return element.innerHTML = spans;
    })
  }
  
  makeSpans('.contact__email');
  
}());


window.onload = function(e){ 
  
  /* --- parallax --- */
  const instances = [];
  const anchor = document.querySelector('.cube__anchor');
  const anchorLaptop = document.querySelector('.laptop__anchor');

  /* cube parallax */
  document.querySelectorAll('.cube__prlx').forEach((elem) => {

    const ty = elem.getAttribute('data-ty') + 'em';
  
    instances.push(basicScroll.create({
      elem: anchor,
      from: 'top-bottom',
      to: 'top-top',
      direct: elem,
      props: {
        '--ty': {
          from: ty,
          to: '0'
        }
      }
    }));
  
  });
  
  /* laptop parallax */
  document.querySelectorAll('.laptop__prlx').forEach((elem) => {

    const tx = elem.getAttribute('data-tx') + 'em';
    const ty = elem.getAttribute('data-ty') + 'em';
  
    instances.push(basicScroll.create({
      elem: anchorLaptop,
      from: 'middle-middle',
      to: 'top-top',
      direct: elem,
      props: {
        '--tx': {
          from: tx,
          to: '0'
        },
        '--ty': {
          from: ty,
          to: '0'
        },
        '--opacity': {
          from: 0,
          to: .99
        }
      }
    }));
  
  });

  /* --- opacity on scroll --- */
  document.querySelectorAll('.about__content, .work__content, .interest__content, .interest__title--recentwork').forEach((elem) => {

    const ty ='3vh';
    const from = window.innerWidth/window.innerHeight<1 ? 'bottom-bottom' : 'top-middle';
    const to = window.innerWidth/window.innerHeight<1 ? 'bottom-middle' : 'middle-middle';

    instances.push(basicScroll.create({
      elem: elem,
      from: from,
      to: to,
      direct: true,
      props: {
        '--opacity': {
          from: 0,
          to: .99
        },
        '--ty': {
          from: ty,
          to: '0'
        }
      }
    }));

  });


  instances.forEach((instance) => instance.start());
  /* --- end parallax --- */

}


/* easings */ 
const ease = {
  cubicInOut: (t) => {
    return t < 0.5
      ? 4.0 * t * t * t
      : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
  }
};

