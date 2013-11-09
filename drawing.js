(function() {

    var Drawing = {

        fillBounds: function(ctx, bounds, styles) {
            ctx.save();

            for (option in styles) {
                ctx[option] = strokeOptions[option];
            }

            ctx.fillRect(bounds[0].x, bounds[0].y, bounds[1].x - bounds[0].x, bounds[1].y - bounds[0].y);

            ctx.restore();
        },

        line: function(ctx, vec1, vec2, styles) {
            var option;

            ctx.save();
            ctx.beginPath()

            for (option in styles) {
                ctx[option] = styles[option];
            }

            ctx.moveTo(vec1.x, vec1.y);
            ctx.lineTo(vec2.x, vec2.y);

            ctx.stroke();

            ctx.restore();
        },

    };

    window.Drawing = Drawing;


})()
