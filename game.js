window.ComponentFactory = {
    titleScreen: function(args, next) {
        return {
            render: function() {
                var container = Util.createElem(
                    'div', 
                    {id: "titleScreen"}, 
                    [
                        ['canvas', {id: "demo"}],
                        ['h1', {id: 'title'}, [['text', 'Intersection']]],
                        ['button', {id: "startButton"}, [['text', 'Play']]]
                    ]
                );
                var button = container.querySelector('#startButton');
                button.addEventListener('click', this.onDone);
                var canvas = container.querySelector('#demo');
                resize(canvas);
                Demo.start(canvas);
                return container;
            },
            onDone: function() {
                Demo.running = false;
                next();
            }
        }
    },
    instructionsScreen: function(args, next) {
        return {
            render: function() {
                var container = Util.createElem(
                    'p', 
                    {id: "instructions"}, 
                    [
                        ['text', 'Tap where you think the lines will intersect.'],
                    ]
                );
                setTimeout(function() {
                    container.classList.add('fadeout');
                }, 2000);
                setTimeout(this.onDone.bind(this), 3000);
                return container;
            },
            onDone: function() {
                next();
            }
        }
    },
    play: function(args, next) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        resize(canvas, 40);
        var component = {
            render: function() {
                game.start();
                return canvas;
            },
            onDone: function() {
                next(game.getScore(), game.getDistance());
            }
        }
        var game = new Game(canvas, ctx, component.onDone, {debug:false});
        return component;
    },
    scoreScreen: function(args, next) {
        return {
            render: function() {
                var container = Util.createElem('div', 
                    {id: 'roundinfo'},
                    [
                        ['h1', {id: 'round'}, [['text', "Round " + args.round + " of " + args.numRounds]]],
                        ['h2', {id: 'distance'}, [['text', Math.round(args.distance) + " px from intersection"]]],
                        ['h2', {id: 'score'}, [['text', args.roundScore + "pts"]]]
                    ]
                );
                setTimeout(function() {
                    container.classList.add('fadein');
                }, 1)
                setTimeout(this.onDone.bind(this), 3000);
                return container;
            },
            onDone: function() {
                next();
            }
        }
    },
    endScreen: function(args, next) {
        return {
            render: function() {
                var container = Util.createElem('div', 
                    {id: 'final'},
                    [
                        ['h1', {id: 'congrats'}, [['text', "Congratulations!"]]],
                        ['h2', {id: 'totalscore'}, [['text', "Total: " + args.totalScore]]],
                        ['button', {id: "restartButton"}, [['text', 'Play Again']]]
                    ]
                );
                var button = container.querySelector('#restartButton');
                button.addEventListener('click', this.onDone);
                twttr.widgets.createShareButton(
                  '/',
                  container,
                  {
                    text: 'I just scored ' + args.totalScore + ' on Intersection. http://miniatureape.github.io/intersection/'
                  }
                );
                return container
            },
            onDone: function() {
                next();
            }
        }
    }
}

window.App = {

    container: document.body,
    round:0,
    score: 0,
    numRounds: 5,

    currentState: 'titleScreen',

    states: {
        titleScreen: {
            from: ['titleScreen', 'endScreen'],
            next: function() {
                this.applyState('instructionsScreen');
            },
        },
        instructionsScreen: {
            from: ['titleScreen'],
            next: function() {
                this.applyState('play');
            },
        },
        play: {
            from: ['instructionsScreen', 'scoreScreen', 'endScreen'],
            next: function(roundScore, distance) {
                this.round++;
                this.score += roundScore;

                this.applyState(
                    'scoreScreen', 
                    {
                        round: this.round,
                        numRounds: this.numRounds,
                        roundScore: roundScore,
                        distance: distance,
                    }
                );
            },
        },
        scoreScreen: {
            from: ['play'],
            next: function() {
                if (this.round < this.numRounds) {
                    this.applyState('play');
                } else {
                    this.applyState('endScreen', {totalScore: this.score});
                }
            },
        },
        endScreen: {
            from: ['scoreScreen'],
            next: function() {
                this.score = 0;
                this.round = 0;
                this.applyState('play')
            }
        },
    },

    applyState: function(state, args) {
        var newState = this.states[state];
        if (newState.from.includes(this.currentState)) {
            this.currentState = state;
            var component = ComponentFactory[state](
                args,
                this.states[state].next.bind(this)
            );
            this.render(component);
        }
    },

    render: function(component) {
        this.container.innerHTML = '';
        this.container.appendChild(component.render());
    },

    run: function(game) {
        this.applyState(this.currentState);
    },
}

App.run();
