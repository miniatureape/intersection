(function() {

    var Marker = function(pos) {
        this.size = new Tween(0, 0, 200);
        this.alpha = new Tween(0, .3, 200);
        this.pos = pos || new Vec(0, 0);
        this.rgb = [239,255,205];
        this.acc = .4
        this.curAcc = this.acc;
        this.visible = false;
    }

    Marker.prototype = {

        reset: function(pos) {
            this.size.start();
            this.alpha.start();

            this.visible = true;
            this.curAcc = this.acc;
            if (pos) {
                this.pos = pos;
            }
        },

        draw: function(ctx) {
            if (!this.visible) return;
            var fill = 'rgba(' + this.rgb.join(',') + ',' + this.alpha.val() + ')';
            var stroke = 'rgb(153, 23, 60)';
            ctx.save();
            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1;
            ctx.translate(this.pos.x, this.pos.y);
            ctx.beginPath();
            ctx.arc(0, 0, this.size.val(), 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, -7);
            ctx.lineTo(0, 7);
            ctx.moveTo(-7, 0);
            ctx.lineTo(7, 0);
            ctx.stroke();
            ctx.restore()
        }, 
        
        update: function() {}
    };

    window.Marker = Marker;


})()
