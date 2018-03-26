(function() {
    
    var Util = {

        createElem: function(elname, attrs, children) {
            console.log(arguments);
            children = children || [];
            var el;
            if (elname === 'text') {
                el = document.createTextNode(attrs);
            } else {
                el = document.createElement(elname);
                for (var key in attrs) {
                    el.setAttribute(key, attrs[key]);
                }
            }
            for (var i = 0; i < children.length; i++) {
                el.appendChild(this.createElem.apply(this, children[i]))
            }
            return el;
        },

        transitionEndName: function(){
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
              'transition':'transitionend',
              'OTransition':'oTransitionEnd',
              'MozTransition':'transitionend',
              'WebkitTransition':'webkitTransitionEnd'
            }

            for(t in transitions){
                if( el.style[t] !== undefined ){
                    return transitions[t];
                }
            }
        },

        requestAnimationFrame: window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

    };

    window.Util = Util;

})()
