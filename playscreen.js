    var Vec = Vector2D,
        raf = Util.requestAnimationFrame,
        _time, 
        width,
        height,
        halfX,
        halfY,

        defaultPadding = 40,
        xaxis   = new Vec(1, 0),
        origin  = new Vec(0, 0),
        center  = new Vec(0, 0),

        messenger        = _.extend({}, Events);

        // Game States

        ROUNDINIT = 'ROUNDINIT',
        EXTEND    = 'EXTEND',
        MEASURE   = 'MEASURE',
        EVALUATE  = 'EVALUATE',
        FINISH    = 'FINISH';

    window.resize = function(canvas, padding) {
        padding = padding || 0;
        canvas.width  = document.documentElement.clientWidth - padding;
        canvas.height = document.documentElement.clientHeight - padding;
        height = canvas.height;
        width = canvas.width;
        halfX = width / 2
        halfY = height / 2;
        center.setCoords(halfX, halfY);
    }

    var Game = function(canvas, ctx, doneFn, options) {

        this.options = _.extend({
            debug: false,
            gutter: 50
        }, options || {});

        this.canvas = canvas;
        this.ctx = ctx;
        this.doneFn = doneFn;

        this.bounds = Geometry.makeBounds(0, 0, canvas.width, canvas.height);
        this.leftBounds = Geometry.makeBounds(0, canvas.height / 2, (canvas.width / 2) - this.options.gutter, (canvas.height / 2) + canvas.height / 2);
        this.rightBounds = Geometry.makeBounds((canvas.width / 2) + this.options.gutter, canvas.height / 2, canvas.width, (canvas.height / 2) + canvas.height / 2);

        this.guess = null;

        this.score = 0;

        this.state = ROUNDINIT;

        this.running = false;

        _.bindAll.apply(_, [this].concat(_.methods(this))); 

        this.bindEvents();
        this.initialize();
    }

    Game.prototype = {

        initialize: function() {
            this.rotation = 0;
            this.yi = null;

            this.leftLine = new Line;
            this.rightLine = new Line;

            messenger.on('line-extended', _.bind(this.finishAligning, this));

            this.marker = new Marker;

            this.drawables = [
                this.leftLine, 
                this.rightLine, 
                this.marker,
            ];

        },

        bindEvents: function() {
            this.canvas.addEventListener('click', this.handleClick);
        },

        handleClick: function(e) {
            e.preventDefault();
            if (this.state != ROUNDINIT) {
                return;
            }
            this.state = 'EXTEND';

            this.guess = new Vec(e.offsetX, e.offsetY)
            this.displayIntersection(this.guess);
        },

        displayIntersection: function(pos) {
            this.marker.reset(pos);
            this.leftLine.extend();
            this.rightLine.extend();
        },

        run: function(step) {
            _time = step;

            if (this.running) {
                raf(this.run);
            }

            this.ctx.save();
            this.clear();

            if (this.options.debug) {
                this.debugDraw();
            }

            var i = 0;
            for (; i < this.drawables.length; i++) {
                this.drawables[i].draw(this.ctx);
                this.drawables[i].update(step);
            }

            this.ctx.restore();
        },

        start: function() {
            this.running = true;
            raf(this.run);
            this.nextRound();
        },

        stop: function() {
            this.running = false;
        },

        nextRound: function() {
            this.state = 'ROUNDINIT';

            this.clicked = false;
            this.yi = new Vec(this.bounds.width() / 2, Math.random() * this.bounds.height());
            this.leftLine.generate(this.yi, this.leftBounds)
            this.rightLine.generate(this.yi, this.rightBounds)
        }, 


        finish: function() {
            setTimeout(this.doneFn, 2000);
        },

        finishAligning: function() {
            if (!(this.state === MEASURE)) {
                this.state = 'MEASURE';
                this.marker.size = new Tween(this.marker.size.val(), this.guess.dist(this.yi));
                this.marker.size.start();
                this.marker.size.onFinish = this.finish;
            }
        },

        getDistance: function() {
            return this.yi.dist(this.guess);
        },

        getScore: function() {
            var dist = this.getDistance();
            if (dist === 0) return 1000;
            return Math.round((1 / dist) * 1000);
        },

        updateScore: function() {
            this.score += this.scoreGuess();
        },

        clear: function() {
            // TODO, consider getting these locally
            this.ctx.clearRect(0, 0, width, height);
        },

        debugDraw: function() {

            this.ctx.save();
            this.ctx.fillStyle = 'white';

            if (this.yi) {
                this.ctx.fillRect(this.yi.x, this.yi.y, 5, 5);
            }

            if (this.halfwayPoint) {
                this.ctx.fillStyle = 'red';
                this.ctx.fillRect(this.halfwayPoint.x, this.halfwayPoint.y, 5, 5);
            }

            if (this.guess && this.yi) {
                var stroke = {
                    'strokeStyle': 'red'
                };
                Drawing.line(this.ctx, this.guess, this.yi, stroke);
            }

            this.ctx.fillStyle = 'pink';
            Drawing.fillBounds(this.ctx, this.leftBounds);
            Drawing.fillBounds(this.ctx, this.rightBounds);
            this.ctx.restore();
        },

    };
