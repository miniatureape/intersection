(function() {
    
    var Tween = function(from, to, ms, start) {
        this.time;
        this.curval = from;
        this.from = from;
        this.to = to;
        this.len = ms || 300;
        this.wasFinished = false;
        if (start) this.start();
    }

    Tween.prototype = {

        start: function(delay) {
            this.started = (new Date).getTime() + (delay || 0);
            this.wasFinished = false;
            webkitRequestAnimationFrame(_.bind(this.tick, this));
        },

        finished: function() {
            return this.started && (this.time - this.started) > this.len;
        },

        tick: function(step) {
            webkitRequestAnimationFrame(_.bind(this.tick, this));

            this.time = step;

            if (this.finished() && !this.wasFinished && this.onFinish) {
                this.wasFinished = true;
                this.onFinish(this);
            }
        },

        val: function() {

            if (this.started > this.time) {
                return this.from;
            }

            if (!this.started) {
                return this.from;
            }

            if (this.finished()) {
                return this.to;
            } 

            // current time = t
            // b = this.from
            // c = this.to - this.from
            // d = len
            var t = (this.time - this.started);
            var c = this.to - this.from;
            var d = this.len;
            var b = this.from;

            // easeInQuart
            this.curval = c * (t /= d) * t * t * t + b;
            // this.curval = (this.to -this.from) * (t /= this.len) * t + this.from
            // this.curval = this.from + ((this.to - this.from) * (this.time - this.started) / this.len );
            return this.curval;
        }
    }

    var TweenVec = function() {
        Tween.apply(this, arguments);
        this.curval = this.curval.get();
    }

    TweenVec.prototype = new Tween;

    TweenVec.prototype.val = function() {

        if (this.started > this.time) {
            return this.from;
        }

        if (!this.started) {
            return this.from;
        }

        if (this.finished()) {
            return this.to;
        }

        this.curval.x = this.from.x + ((this.to.x - this.from.x) * (this.time - this.started) / this.len );
        this.curval.y = this.from.y + ((this.to.y - this.from.y) * (this.time - this.started) / this.len );

        return this.curval;
    };

    window.Tween = Tween;
    window.TweenVec = TweenVec;

})()
