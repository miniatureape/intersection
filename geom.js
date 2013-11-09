(function() {

    var Geometry = {

       // Given top left x, y and bottom right x, y
       // return 2 element array representing topleft and bottom right of a box.
       
       makeBounds: function(topLeft, topRight, bottomLeft, bottomRight) {
            var bounds = [new Vec(topLeft, topRight), new Vec(bottomLeft, bottomRight)];
            bounds.width = function() {
                return bounds[1].x - bounds[0].x;
            };
            bounds.height = function() {
                return bounds[1].y - bounds[0].y;
            };
            return bounds;
        },

        // Given top left and bottom right vectors, 
        // return a random vector in that area.
        
        boundedRand: function(boundary) {
            var tlVec = boundary[0];
            var brVec = boundary[1];
            var x = (Math.random() * (brVec.x - tlVec.x) + tlVec.x),
                y = (Math.random() * (brVec.y - tlVec.y) + tlVec.y);
                return new Vec(x, y);
        }

    };

    window.Geometry = Geometry;


})()
