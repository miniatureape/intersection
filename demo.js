var lasttime = 0;;
window.Demo = {
    running: false,
    ctx: null,
    lines: [],
    start: function(canvas) {
        this.running = true;
        raf(this.run.bind(this));
        this.ctx = canvas.getContext('2d');
        this.bounds = Geometry.makeBounds(0, 0, canvas.width, canvas.height);
        this.leftBounds = Geometry.makeBounds(0, canvas.height / 2, (canvas.width / 2) - 40, (canvas.height / 2) + canvas.height / 2);
        this.rightBounds = Geometry.makeBounds((canvas.width / 2)+ 40, canvas.height / 2, canvas.width, (canvas.height / 2) + canvas.height / 2);
    },
    run: function(step) {
        if ((step - lasttime) > 3000) {
            lasttime = step;
            var line = new Line;
            var yi = new Vec(this.bounds.width() / 2, Math.random() * this.bounds.height());
            line.generate(yi, this.bounds);
            this.lines.push(line);
            line.extend();
        }

        this.ctx.clearRect(0, 0, this.bounds.width, this.bounds.height);
        for (var i=0; i < this.lines.length; i++) {
            this.lines[i].draw(this.ctx);
            this.lines[i].update(step);
        }

        if (this.running) {
            raf(this.run.bind(this));
        }

    }
}
console.log(Demo);
