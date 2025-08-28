window.ParticleSystem = (function ParticleSystem() {
	var particleSystems = new Set();
	function create (spec, graphics) {
		let that = {};
		let particles = [];
		that.render = function() {};
		// if(spec.image) {
		// 	let image = new Image();
		// 	image.onload = function () {
		// 		that.render = function() {
		// 			for (let particle = 0; particle < particles.length; particle++) {
		// 				if (particles[particle].alive >= 100) {
		// 					//graphics.drawRectangle(
		// 						// particles[particle].position,
		// 						// particles[particle].size,
		// 						// particles[particle].rotation,
		// 						// particles[particle].fill,
		// 						// particles[particle].stroke);
		// 					graphics.drawImage(
		// 						particles[particle].position,
		// 						particles[particle].size,
		// 						particles[particle].rotation,
		// 						image);
		// 				}
		// 			}
		// 		};	
		// 	};
		// 	image.src = spec.image;
		// } else {
		var totalTimeElapsed = 0;
		that.render = function() {
			for (let particle = 0; particle < particles.length; particle++) {
				graphics.renderCircle({
					x: particles[particle].position.x,
					y: particles[particle].position.y,
					radius: Math.max(0, particles[particle].size / 2),
					color: spec.color,
					opacity: (spec.opacity * (1 - totalTimeElapsed/spec.systemLifetime)),
				})
			}
		};
		// }

		var cornerPoints = [
			{
				x: spec.position.xMin,
				y: spec.position.yMin,
			},
			{
				x: spec.position.xMax,
				y: spec.position.yMin,
			},
			{
				x: spec.position.xMin,
				y: spec.position.yMax,
			},
			{
				x: spec.position.xMax,
				y: spec.position.yMax,
			}
		];
		var highSpeed = spec.speed.mean + spec.speed.stdev;
		var longLife  = spec.lifetime.mean + spec.lifetime.stdev;
		var largeLifeDistance = highSpeed * longLife;
		var largeStartDistance = Math.max(...cornerPoints.map(x => distBetweenPoints(x, spec.position)));
		var largeDistance = largeLifeDistance + largeStartDistance;
		function setSpeedByCenterOffset (particle) {
			particle.speed = Math.max(0, particle.maxSpeed * (1 - distBetweenPoints(particle.position, spec.position)/largeDistance));
		}

		function distBetweenPoints (a, b) {
			return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
		}

		var first = true;
		that.update = function(elapsedTime) {
			totalTimeElapsed += elapsedTime;
			if(totalTimeElapsed > spec.systemLifetime) {
				particleSystems.delete(that);
			}
			let keepMe = [];
			var particlesThisTime = spec.particlesPerUpdate

			for (let particle = 0; particle < particles.length; particle++) {
				particles[particle].alive += elapsedTime;
				particles[particle].position.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
				particles[particle].position.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);
				particles[particle].rotation += particles[particle].speed / .5;

				setSpeedByCenterOffset(particles[particle]);
				if (particles[particle].alive <= particles[particle].lifetime) {
					keepMe.push(particles[particle]);
				}
			}

			for (let particle = 0; particle < spec.particlesPerUpdate; particle++) {
				let maxSpeed = Random.nextGaussian( spec.speed.mean, spec.speed.stdev );
				let p = {
					position: { x: Random.nextRange(spec.position.xMin, spec.position.xMax), y: Random.nextRange(spec.position.yMin, spec.position.yMax) },
					direction: Random.nextCircleVector(),
					maxSpeed,
					speed: maxSpeed,	// pixels per millisecond
					rotation: 0,
					lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// milliseconds
					alive: 0,
					size: Random.nextGaussian(spec.size.mean, spec.size.stdev),
					fill: spec.fill,
					stroke: 'rgb(0, 0, 0)'
				};
				setSpeedByCenterOffset(p);
				keepMe.push(p);
			}
			first = false;
			particles = keepMe;
		};

		particleSystems.add(that);
	}

	function update (elapsed) {
		for(const p of particleSystems) {
			p.update(elapsed);
		}
	}

	function render (elapsed) {
		for(const p of particleSystems) {
			p.render(elapsed);
		}
	}

	return {
		create,
		update,
		render,
	}
})();
