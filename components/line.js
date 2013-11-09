(function() {

    var Line = function(options) {
        this.options = _.extend({
            rgb: [239,255,205],
        }, options || {});
        this.start = null;
        this.end = null;
        this.debug = false;
        this.alpha = new Tween(0, 1, 300);
    }

    Line.prototype = {

        draw: function(ctx) {
            if (!this.start || !this.end) return;

            if (this.debug) {
                this.debugDraw(ctx);
            }

            ctx.save();

            var stroke = {
                'strokeStyle': 'rgba(' + this.options.rgb.join(',') + ',' + this.alpha.val() + ')'
            }

            Drawing.line(ctx, this.start, this.end.val(), stroke);
            ctx.restore();

        },

        debugDraw: function(ctx) {
            ctx.fillRect(this.start.x, this.start.y, 5, 5);
            ctx.fillRect(this.end.val().x, this.end.val().y, 5, 5);
            Drawing.line(ctx, this.start, this.end.val());
        },

        update: function() {},

        reset: function() {
            this.alpha.start();
        },

        generate: function(yi, bounds) {
            var diff, ray;
            this.start = Geometry.boundedRand(bounds);
            diff = Vec.sub(yi, this.start);
            diff.scale(.3)
            var end = Vec.add(this.start, diff);
            this.end = new TweenVec(end, end.get(), 500);
            this.end.onFinish = this.finishExtending
            this.alpha.start();
        },

        extend: function() {
            var diff = Vec.sub(this.end.val(), this.start);
            diff.normalize();
            diff.scale(width);
            this.end.to = Vec.add(this.end.val(), diff);
            this.end.start();
        },

        finishExtending: function() {
            messenger.trigger('line-extended');
        }

    };

    window.Line = Line;

})()
