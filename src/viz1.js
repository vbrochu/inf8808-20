'use strict'

import * as preprocess from './preprocess.js'


import d3Tip from 'd3-tip'

/*
 * Appends an SVG g element which will contain the y axis.
 *
 * @param {*} g D3 Selection of g
 */
export function appendAxes (g) {
  g.append('g')
    .attr('class', 'x axis')
}


/*
 * defines the x scale.
 *
 * @param {*} scale The x scale
 * @param {number} width Width of the graph
 */
export function updateXScale (scale, width) {
    //ECHELLE FIXE
    scale.domain([1985, 2019]).range([0,570]);
}


/**
 * Draws the X axis at the bottom of the diagram.
 *
 * @param {*} xScale The scale to use to draw the axis
 * @param {number} height The height of the graphic
 */
export function drawXAxis (xScale, height) {
  d3.select('#viz1 .x.axis')
    .attr('transform', 'translate( 0, ' + height + ')')
    .call(d3.axisBottom(xScale).tickValues(["1985","2019"]).tickFormat(d3.format("d")))
}

/**
 * Defines the contents of the tooltip for the waffle.
 *
 * @param {object} c The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContentsWaffle (c) {
	const labelTitre = "<div class=\"tooltip-title\">Film : "+c[0].titreOriginal+"</div>";
	const labelAnneeSortie = "<div class=\"tooltip-title\">Année de sortie : "+c[0].anneeSortie+"</div>";

	return labelTitre+labelAnneeSortie;
}

/**
 * Generates the SVG element g which will contain the data visualisation.
 *
 * @param {object} margin The desired margins around the graph
 * @returns {*} The d3 Selection for the created g element
 */
export function generateG (margin) {
  return d3.select('#viz1')
    .select('.waffle-svg')
    .append('g')
    .attr('id', 'waffle-g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')')
}

/**
 * Sets the size of the SVG canvas containing the graph.
 *
 * @param {number} width The desired width
 * @param {number} height The desired height
 */
export function setCanvasSizeWaffle (width, height) {
  d3.select('#viz1').select('svg')
    .attr('width', width)
    .attr('height', height)
}



/**
 * Draws the buttons to select the roles.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {object[]} roles The roles to display
 * @param {number} width The width of the graph, used to place the button
 * @param {number} bounds_width The width of the screen
 */
export function drawButtonsWaffle (g, roles, width, bounds_width) {
	
	const button_width = 110
	const button_height = 25
	
	var X = 600
	var Y = 0
	
	const maxY=420
	var res
	
	function set_pos() {
		if (Y < maxY) {
			res = X+','+Y
			Y=Y+button_height
		} else {
			Y=0
			X=X+button_width
			res = X+','+Y
		}
		return res
	}

	roles.forEach( role => {
		const button = g.append('g')
			.attr('class', 'button-waffle')
			.attr('id', 'button-waffle-'+role.toLowerCase().replaceAll(" ", "-").replaceAll("é","e"))
			.attr('transform', 'translate('+set_pos()+')')
			.attr('width', button_width)
			.attr('height', button_height)

		button.append('rect')
			.attr('width', button_width)
			.attr('height', button_height)
			.attr('fill', '#f4f6f4')
			.on('mouseenter', function () {
			  d3.select(this).attr('stroke', '#362023')
			})
			.on('mouseleave', function () {
			  d3.select(this).attr('stroke', '#f4f6f4')
			})

		button.append('text')
			.attr('x', button_width/2)
			.attr('y', button_height/2)
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle')
			.attr('class', 'button-text')
			.text(role)
			.attr('font-size', '10px')
			.attr('fill', '#362023')
	})
}


/**
 * Dessine la waffle
 * @param {object[]} sorted_filmo_part Films et leurs participants triés par années de sortie
 * @param {number} height The height of the graph
 * @param {number} width The width of the graph
 * @param {string} essential_function Fonction we have to see if it is essential or not
 */
export function draw (sorted_filmo_part, height, width, essential_function, tip) {
	
	const cote_motif=5

	const trunc_width = Math.trunc(width)

	function setColor(e) {
		var i = 0
		var found=false
		while ((i < e[1].participants.length) && (!found)) {
			if (e[1].participants[i].fonction == essential_function) {
				found=true
			}
			i++
		}
		if (found) {
			return '#38b0de'
		} else {
			return '#d3d3d3'
		}
		
	}
	
	function setX(e, i) {
		return Math.floor((i*cote_motif)/height)*cote_motif
	}
	
	function setY(e, i) {
		return (i*cote_motif)%height
	}
	
	function handleMouseOver(c, d) {
		tip.show(c, d);
		d3.select(d)
		.attr('width', cote_motif+1)
		.attr('height', cote_motif+1)
		.attr("stroke", "black");
	}
	
	function handleMouseOut(c, d) {
		tip.hide();
		d3.select(d)
		.attr('width', cote_motif)
		.attr('height', cote_motif)
		.attr("stroke", "white");
	}

	d3.select('#waffle-g')
		.selectAll('rect')
		.data(sorted_filmo_part)
		.enter()
		.append('g')
		.attr('class', 'waffle-rect')
		.append('rect')
		.attr('y', setY)
		.attr('x', setX)
		.attr('width', cote_motif)
		.attr('height', cote_motif)
		.attr('fill', setColor)
		.attr("stroke", "white")
		.attr("stroke-width", 1)
		.on("mouseover", function(c) { 
			handleMouseOver(c, this)
		})
		.on("mouseout", function(c) { 
			handleMouseOut(c, this)
		});

}




(function (d3) {
	const margin_waffle = { top: 80, right: 0, bottom: 80, left: 50 }

	let boundsWaffle
	let svgSizeWaffle
	let graphSizeWaffle
	
	const tipWaffle = d3Tip().attr('class', 'd3-tip').html(function (d) { return getContentsWaffle(d) })
	d3.select('.waffle-svg').call(tipWaffle)

	let data_noms
	let data_filmo
	let data_fonction

	//associe nomId aux noms et prénoms
	let dict_nomsId
	
	//associe fonction id au terme de la fonction
	let dict_fonctionId
	
	//associe un id de film ses titre et année de sortie
	let dict_filmoId
	
	//liste [film id, anneeSortie, participants] triée par années de sortie
	let sorted_filmo_part

	const xScale = d3.scaleLinear()

Promise.all([
    d3.csv('./Nom.csv'),
    d3.csv('./Fonction.csv'),
	d3.csv('./Filmo.csv'),
	d3.csv('./Filmo_Generique.csv'),
]).then(function(fichiers) {
	
	//preoprocess des fichiers
	dict_nomsId = preprocess.buildDictNoms(fichiers[0]);
	dict_fonctionId = preprocess.buildDictFonctions(fichiers[1]);
	dict_filmoId = preprocess.buildDictFilmoId(fichiers[2]);
	
	let aux=preprocess.buildDictCareer(fichiers[3], dict_filmoId, dict_fonctionId, dict_nomsId);
	sorted_filmo_part=aux[1]
	
	buildWaffle()
	
	function setSizingWaffle () {
		boundsWaffle = d3.select('#viz1').node().getBoundingClientRect()
		let graphWidth = Math.min(self.innerWidth, 1000);
    	let graphHeight = 600;

		svgSizeWaffle = {
			width: graphWidth,
			height: graphHeight
		}

		graphSizeWaffle = {
			width: svgSizeWaffle.width - margin_waffle.right - margin_waffle.left,
			height: svgSizeWaffle.height - margin_waffle.bottom - margin_waffle.top
		}

		setCanvasSizeWaffle(svgSizeWaffle.width, svgSizeWaffle.height)
	}

	function setClickHandlerWaffle (role) {

		d3.select('#button-waffle-'+role.toLowerCase().replaceAll(" ", "-").replaceAll("é","e"))
			.on('click', () => {
				d3.selectAll('.waffle-rect').remove()
				draw(sorted_filmo_part, graphSizeWaffle.height, graphSizeWaffle.width, role, tipWaffle)
			}
		)
	}

	/**
	 *   This function builds the graph.
	 */
	function buildWaffle () {
		setSizingWaffle()
		
		const g = generateG(margin_waffle)
		
		const roles = Object.values(dict_fonctionId)
		
		drawButtonsWaffle(g, roles, graphSizeWaffle.width, boundsWaffle.width)
		
		

		draw(sorted_filmo_part, graphSizeWaffle.height, graphSizeWaffle.width, 'Chroniqueur', tipWaffle)
		
		roles.forEach(role => setClickHandlerWaffle(role))

		updateXScale(xScale, graphSizeWaffle.width)
        appendAxes(g)
        drawXAxis(xScale, graphSizeWaffle.height)
	}

	
}).catch(function(err) {
    console.log('Les .csv n\'ont pas pu être lus');
})

})(d3)