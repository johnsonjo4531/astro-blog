window.Geometry = (function () {
  function pointInPolygon () {

  }

  function Point () {

  }

  function Line () {

  }

  function Ray () {

  }

  function Circle (spec) {
    let that = {
      radius: spec.radius,
      x: spec.x,
      y: spec.y,
      get boundingRect () {
        return Rectangle({
          width: that.radius * 2,
          height: that.radius * 2,
          x: that.x - that.radius,
          y: that.y - that.radius,
        });
      }
    }

    return that;
  }

  function Rectangle (spec) {
    // x and y is from top left corner
    var center = {
      get x () {
        return that.x + that.width / 2
      },
      get y () {
        return that.y + that.height / 2;
      },
    };
    var that = {
      height: spec.height,
      width: spec.width, 
      x: spec.x,
      y: spec.y,
      get top () {
        return that.y;
      },
      get left () {
        return that.x;
      },
      get right () {
        return that.x + that.width;
      },
      get bottom () {
        return that.y + that.height;
      },
      get center () {
        return center
      },
      intersectsRect (B) {
        // https://gamedev.stackexchange.com/a/29796
        const A = that;
        const w = 0.5 * (A.width + B.width);
        const h = 0.5 * (A.height + B.height);
        const dx = A.center.x - B.center.x;
        const dy = A.center.y - B.center.y;

        if (Math.abs(dx) <= w && Math.abs(dy) <= h)
        {
          /* collision! */
          const wy = w * dy;
          const hx = h * dx;

          if (wy > hx) {
            if (wy > -hx) {
              /* at the bottom */
              return Rectangle.intersectDir.bottom;
            } else {
                /* on the left */
                return Rectangle.intersectDir.left;
            }
          }else {
            if (wy > -hx) {
              /* on the right */
              return Rectangle.intersectDir.right;
            } else {
              /* collision at the top */
              return Rectangle.intersectDir.top;
            }
          }
        } else {
          return false;
        }
      },
      // get edges () {
      //   return [that]
      // },
    };
    
    return that;
  }
  Rectangle.intersectDir = {
    left: 'left',
    right: 'right',
    bottom: 'bottom',
    top: 'top'
  }

  return {
    Rectangle,
    Circle,
  };
})();
