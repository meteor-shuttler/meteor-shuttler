if (Meteor.isClient) {
	var construct = function() {
		particlesJS("stars", {
			"particles": {
				"number": {
					"value": 246,
					"density": {
						"enable": false,
						"value_area": 1972.8691040806818
					}
				},
				"color": {
					"value": "#ffffff"
				},
				"shape": {
					"type": "circle",
					"stroke": {
						"width": 0,
						"color": "#ffffff"
					},
					"polygon": {
						"nb_sides": 3
					},
					"image": {
						"src": "img/github.svg",
						"width": 100,
						"height": 100
					}
				},
				"opacity": {
					"value": 0.5,
					"random": false,
					"anim": {
						"enable": false,
						"speed": 1,
						"opacity_min": 0.1,
						"sync": false
					}
				},
				"size": {
					"value": 3,
					"random": true,
					"anim": {
						"enable": false,
						"speed": 40,
						"size_min": 0.1,
						"sync": false
					}
				},
				"line_linked": {
					"enable": true,
					"distance": 120,
					"color": "#ffffff",
					"opacity": 0.1,
					"width": 0.5
				},
				"move": {
					"enable": true,
					"speed": 0.5,
					"direction": "bottom",
					"random": false,
					"straight": true,
					"out_mode": "out",
					"bounce": false,
					"attract": {
						"enable": true,
						"rotateX": 1262.6362266116362,
						"rotateY": 1200
					}
				}
			},
			"interactivity": {
				"detect_on": "canvas",
				"events": {
					"onhover": {
						"enable": false,
						"mode": "repulse"
					},
					"onclick": {
						"enable": false,
						"mode": "push"
					},
					"resize": true
				},
				"modes": {
					"grab": {
						"distance": 400,
						"line_linked": {
							"opacity": 1
						}
					},
					"bubble": {
						"distance": 400,
						"size": 40,
						"duration": 2,
						"opacity": 8,
						"speed": 3
					},
					"repulse": {
						"distance": 200,
						"duration": 0.4
					},
					"push": {
						"particles_nb": 4
					},
					"remove": {
						"particles_nb": 2
					}
				}
			},
			"retina_detect": true
		});
	};
	var destroy = function() {
		pJSDom[0].pJS.fn.vendors.destroypJS();
		window.pJSDom = [];
	};
	var resize = function() {
		destroy();
		construct();
	};
	Template['stars'].onRendered(construct);
	Template['stars'].onRendered(function() {
		$(window).on('resize', resize);
	});
	Template['stars'].events({
		load: resize
	});
	Template['stars'].onDestroyed(function() {
		$(window).off('resize', resize);
	});
	Template['stars'].onDestroyed(destroy);
}