(function() {

    var Marker = function(pos) {
        this.size = new Tween(0, 30, 200);
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
            ctx.save();
            ctx.fillStyle = fill;
            ctx.translate(this.pos.x, this.pos.y);
            ctx.beginPath();
            ctx.arc(0, 0, this.size.val(), 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, -(this.size.val() / 7));
            ctx.lineTo(0, (this.size.val() / 7));
            ctx.moveTo(-(this.size.val() / 7), 0);
            ctx.lineTo((this.size.val() / 7), 0);
            ctx.stroke();
            ctx.restore()
        }, 
        
        update: function() {}
    };

    window.Marker = Marker;


})()
