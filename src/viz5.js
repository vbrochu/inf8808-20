'use strict'

import * as preprocess from './preprocess.js'

import d3Tip from 'd3-tip'
import d3Legend from 'd3-svg-legend'

const COLORS = [
	'#fe0002',	//red
	'#0100fe',	//blue
	'#019a01',	//green
	'#ff9a00',	//orange
	'#ffff01',	//yellow
	'#ffcdd0',	//pink
	'#980086',	//purple
	'#01ffff',	//cyan
	'#ff804d',	//coral
	'#018184',	//teal
	'#582900',	//brown
	'#000000',	//black
	'##020085',	//navy
	'#ff83f3',	//mauve
	'#ffffff',	//white
	'#d3d3d3',	//grey
	'#94812b',	//kaki
	'#cc5500',	//fire
	'#c09628',	//gold
	'#293133'	//anhtracite
]

const MIN_YEAR = 1900
const MAX_YEAR = 2020



/**
 * Generates the SVG element g of id viz5 which will contain the histogram.
 *
 * @param {object} margin Margins around the graph
 * @returns {*} D3 Selection of viz5 element
 */
export function generateGHistogram (margin) {
  return d3.select('#viz5')
    .select('.histogram-svg')
    .append('g')
    .attr('id', 'histogram-g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')')
}


/**
 * Appends an SVG g element which will contain the y axis.
 *
 * @param {*} g D3 Selection of g
 */
export function appendAxes (g) {
  g.append('g')
    .attr('class', 'x axis')

  g.append('g')
    .attr('class', 'y axis')
}


/**
 * Appends the labels for the the y axis and the title of the graph.
 *
 * @param {*} g D3 Selection of g
 */
export function appendGraphLabels (g) {
  g.append('text')
    .text('Roles')
    .attr('class', 'y axis-text')
    .attr('transform', 'rotate(-90)')
    .attr('fill', '#898989')
    .attr('font-size', 12)

  g.append('text')
    .text('Years')
    .attr('class', 'title')
    .attr('fill', '#898989')
}

/**
 * Sets the size of the SVG canvas containing the histogram.
 *
 * @param {number} width Given width for the canvas
 * @param {number} height Given height for the canvas
 */
export function setCanvasSizeHistogram (width, height) {
  d3.select('#viz5').select('svg')
    .attr('width', width)
    .attr('height', height)
}


/**
 * Positions the x and y axis labels and title.
 *
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 */
export function positionLabels (width, height) {
  d3.select('#viz5 .y.axis-text')
    .attr('x', 100)
    .attr('y', height / 2 - 220)

  d3.select('#viz5 .title')
    .attr('x', width / 2)
    .attr('y', -35)
}


/**
 * Draws the x axis at the bottom of the plot.
 *
 * @param {*} xScale The scale to use for the x axis
 * @param {number} height The height of the graph
 */
export function drawXAxis (xScale, height) {
  d3.select('#viz5 .x.axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(d3.axisBottom(xScale).tickFormat(x =>String(x)))
}

/**
 * Draws the y axis at the left of the plot.
 *
 * @param {*} yScale The scale to use for the y axis
 */
export function drawYAxis (yScale) {
  d3.select('#viz5 .y.axis').call(d3.axisLeft(yScale).ticks(5))
}

/**
 * defines the x scale.
 *
 * @param {*} scale The x scale
 * @param {object[]} data_career Career of the seleted person
 * @param {number} width Width of the graph
 */
export function updateXScale (scale, data_career, width) {
	//ECHELLE FIXE
	scale.domain([MIN_YEAR, MAX_YEAR]).range([0,width]);
}

/**
 * defines the y scale.
 *
 * @param {*} scale The y scale
 * @param {object[]} data_career Career of the seleted person
 * @param {number} height Height of the graph
 */
export function updateYScale (scale, data_career, height) {
	var dict_year = {}
	
	var max_roles=0
	var found=false
	
	data_career.forEach(c => {
		let annee_sortie = c.film.anneeSortie
		if (!(isNaN(annee_sortie))) {
			if (annee_sortie in dict_year) {
				dict_year[annee_sortie]++
			}
			else {
				dict_year[annee_sortie]=1
			}
			if (dict_year[annee_sortie]>max_roles) {
				max_roles=dict_year[annee_sortie]
				found=true
			}
		}
	});
	
	if (found) {
		scale.domain([0, max_roles]).range([height, 0]);
	} else {
		scale.domain([0, data_career.length]).range([height, 0]);
	}
}


/**
 * @param {object[]} data_career Career of the seleted person
 * @returns {*} The ordinal scale used to determine the color of rects
  * @param {object} dict_fonctionId The dictionary fonctionId - fonction (terme)
 */
export function setColorScale (data_career, dict_fonctionId) {

	//on compte le nombre de rôles différents
	var set_roles = new Set();
	data_career.forEach(c => set_roles.add(c.fonctionCategory))
	
	let roles = Array.from(set_roles);
	const nbre_roles = roles.length;


	return d3.scaleOrdinal()
	  .domain(roles)
	  .range(COLORS.slice(0, nbre_roles));
}



/**
 * Draws the histogram
 *
 * @param {*} yScale vertical y scale of the graph
 * @param {*} xScale horizontal x scale of the graph
 * @param {object[]} data_career Career of the seleted person
 * @param {number} height The height of the graph
 * @param {number} width The width of the graph
 * @param {*} colorScale The ordinal scale used to determine the color of rects
 * @param {*} tip The tooltip to display information for each square
 */
export function drawHistogram (yScale, xScale, data_career, height, width, colorScale, tip) {
	//dict pour compter le nombre de rôles par année
	//et ajuster y en fonction
	var dict_count = {}
	
	const y_length_rect = height/8
	const x_length_rect = width/(MAX_YEAR-MIN_YEAR)
		
	
	function setY(c) {
		
		//on màj dict_count
		let annee_film=c.film.anneeSortie
		if (annee_film in dict_count) {
			dict_count[annee_film]++
		} else {
			dict_count[annee_film]=1
		}
		
		if (isNaN(annee_film)) {
			return yScale(3)
		} else {
			return yScale(dict_count[annee_film])
		}
	}
	
	function setX(c) {
		let annee_film=c.film.anneeSortie
		if (isNaN(annee_film)) {
			return xScale(1950)
		} else {
			return xScale(annee_film)
		}
	}
	
	function setOpacity(c) {
		let annee_film=c.film.anneeSortie
		if (isNaN(annee_film)) {
			return 0
		} else {
			return 1
		}
	}
	
	d3.select('#histogram-g')
		.selectAll('rect')
		.data(data_career)
		.enter()
		.append('g')
		.attr('class', 'role-rect')
		.append('rect')
		.attr('x', setX)
		.attr('y', setY)
		.attr('width', x_length_rect)
		.attr('height', y_length_rect)
		.attr('fill', c => colorScale(c.fonctionCategory))
		.attr("stroke", "white")
		.attr("stroke-width", 1)
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.style("opacity", setOpacity);
}


/**
 * Draws the legend for the colors of the squares.
 *
 * @param {*} g D3 Selection of the SVG g element
 * @param {*} colorScale The color scale used for the squares
 */
export function drawLegendHistogram (g, colorScale, width) {
 
	const offset_x=width+40
 
	g.append("g")
	  .attr("class", "legendOrdinal")
	  .attr("transform", "translate("+offset_x+",20)")

	var legendOrdinal = d3Legend.legendColor()
	  .shape("path", d3.symbol().type(d3.symbolCircle).size(200)())
	  .scale(colorScale)
	  .title("Légende");
	  

	g.select(".legendOrdinal")
	  .call(legendOrdinal);
	  
}

/**
 * contents of the tooltip for the histogram.
 *
 * @param {object} c Hovered element's data
 * @returns {string} Contents of the tooltip to be displayed
 */
export function getContentsHistogram (c) {
	const labelTitre = "<div class=\"tooltip-title\">Film : "+c.film.titreOriginal+"</div>";
	const labelFonction = "<div class=\"tooltip-title\">Fonction : "+c.fonction+"</div>";

	return labelTitre+labelFonction;
}


(function (d3) {
	const margin_histogram = { top: 80, right: 200, bottom: 80, left: 55 }
	
	let boundsHistogram
	let svgSizeHistogram
	let graphSizeHistogram

	const xScale = d3.scaleLinear()
	const yScale = d3.scaleLinear()
	
	const tipHistogram = d3Tip().attr('class', 'd3-tip').html(function (d) { return getContentsHistogram(d) })
	d3.select('.histogram-svg').call(tipHistogram)
	
	let colorScale

	//associe nomId aux noms et prénoms
	let dict_nomsId
	
	//associe fonction id au terme de la fonction
	let dict_fonctionId
	
	//associe un id de film ses titre et année de sortie
	let dict_filmoId

	//associe un nom à sa carrière (roles et films)
	let dict_noms_car
	
	//liste [film id, anneeSortie, participants] triée par années de sortie
	let sorted_filmo_part


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
	dict_noms_car=aux[0]
	sorted_filmo_part=aux[1]
	buildHistogram()

	

    /**
     *   This function handles the graph's sizing.
     */
    function setSizingHistogram () {
      //boundsHistogram = d3.select('#viz5').node().getBoundingClientRect()
	  let graphWidth = Math.min(self.innerWidth, 1500);
	  let graphHeight = 350;

      svgSizeHistogram = {
        //width: boundsHistogram.width,
		width: graphWidth,
        height: graphHeight
      }

      graphSizeHistogram = {
        width: svgSizeHistogram.width - margin_histogram.right - margin_histogram.left,
        height: svgSizeHistogram.height - margin_histogram.bottom - margin_histogram.top
      }

      setCanvasSizeHistogram(svgSizeHistogram.width, svgSizeHistogram.height)
    }



    /**
     *   This function builds the histogram.
     */
    function buildHistogram () {
		setSizingHistogram()
		
		const g = generateGHistogram(margin_histogram)

		appendAxes(g)
		appendGraphLabels(g)
		positionLabels(graphSizeHistogram.width, graphSizeHistogram.height)

		let NOM_TEST=15334

		updateXScale(xScale, dict_noms_car[NOM_TEST], graphSizeHistogram.width)
		updateYScale(yScale, dict_noms_car[NOM_TEST], graphSizeHistogram.height)

		colorScale=setColorScale(dict_noms_car[NOM_TEST], dict_fonctionId)

		drawXAxis(xScale, graphSizeHistogram.height)
		drawYAxis(yScale)

		drawHistogram(yScale, xScale, dict_noms_car[NOM_TEST], graphSizeHistogram.height, graphSizeHistogram.width, colorScale, tipHistogram, dict_filmoId)

		drawLegendHistogram(g, colorScale, graphSizeHistogram.width)
    }
	
	
	
}).catch(function(err) {
    console.log('Les .csv n\'ont pas pu être lus');
})

})(d3)