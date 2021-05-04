'use strict'

import * as preprocess from './preprocess.js'

import d3Tip from 'd3-tip'
import d3Legend from 'd3-svg-legend'

const COLORS = [
	'#0100fe',	//blue
	'#019a01',	//green
	'#01ffff',	//cyan
	'#980086',	//purple
	'#94812b',	//kaki	
	'#ffff01',	//yellow
	'#fe0002',	//red
	'#e673d6',	//pink
	'#ff9a00',	//orange
	'#ff804d',	//coral
	'#018184',	//teal
	'#582900',	//brown
	'#000000',	//black
	'#020085',	//navy
	'#ff83f3',	//mauve
	'#cc5500',	//fire
	'#d9d9d9',	//light grey
	'#c09628',	//gold
	'#293133',	//anthracite
	'#d3d3d3'	//grey
]

//rôles que l'on considère dans cette viz
const ROLES = [
	'Acteur',
	'Production',
	'Image',
	'Scénario',
	'Générique additionnel',
	'Science',
	'Direction artistique',
	'Narration',
	'Photographe de plateau',
	'Son',
	'Direction de production',
	'Esthetique',
	'Assistant réalisation',
	'Documentaire/émission'
]

//nombre de noms représentés
const NB_NOMS = 10


let MODE = 'top_poly'


/**
 * Generates the SVG element g of id viz5 which will contain the matrix.
 *
 * @param {object} margin Margins around the graph
 * @returns {*} D3 Selection of viz5 element
 */
export function generateGMatrix (margin) {
  return d3.select('#viz4')
    .select('.matrix-svg')
    .append('g')
    .attr('id', 'matrix-g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')')
}


/*
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
 * Sets the size of the SVG canvas containing the matrix.
 *
 * @param {number} width Given width for the canvas
 * @param {number} height Given height for the canvas
 */
export function setCanvasSizeMatrix (width, height) {
  d3.select('#viz4').select('svg')
    .attr('width', width)
    .attr('height', height)
}




/**
 * @param {object[]} data_career Career of the seleted person
 * @returns {*} The ordinal scale used to determine the color of rects
  * @param {object} dict_fonctionId The dictionary fonctionId - fonction (terme)
 */
export function setColorScale () {

	return d3.scaleOrdinal()
	  .domain(ROLES)
	  .range(COLORS.slice(0, ROLES.length));
}



/**
 * cree les rectangles
 *
 * @param {object[]} data Data à lier aux rects
 */
export function appendRects (data) {
	d3.select('#matrix-g')
		.selectAll()
		.data(data)
		.enter()
		.append('g')
		.attr('class', 'matrix-rect')
		.append('rect');
}

/**
 * cree les rectangles
 *
 * @param {object[]} data Data à lier aux circles
 * @param {object} tip top be shown when a square is hovered
 */
 export function appendCircles (data, tip, dict_radiusScale) {


    function handleMouseOver(c, d) {
        if (c[MODE].count > 0) {
            tip.show(c, d);
            d3.select(d)
            .attr("r", c => dict_radiusScale[MODE](c[MODE].count)+2);
        }
    }

    function handleMouseOut(c, d) {
        if (c[MODE].count > 0) {
            tip.hide();
            d3.select(d)
            .attr("r", c => dict_radiusScale[MODE](c[MODE].count));
        }
    }


    d3.select('#matrix-g')
        .selectAll()
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'matrix-circle')
        .append('circle')
        .on("mouseover", function(c) { 
            handleMouseOver(c, this)
        })
        .on("mouseout", function(c) { 
            handleMouseOut(c, this)
        });
}



/**
 * établit domaine et range pour échelle x
 *
 * @param {*} xScale Echelle axe x
 * @param {string[]} roles Les rôles possibles
 * @param {number} height Taille du graphe
 */
export function updateXScale (xScale, roles, width) {
  xScale.domain(roles)
    .range([0,width]);
}


/**
 * établit domaine et range pour échelle y
 *
 * @param {*} yScale Echelle axe y
 * @param {string[]} noms Noms des personnes
 * @param {number} height Taille du graphe
 */
export function updateYScale (yScale, noms, height) {
  yScale.domain(noms)
    .range([0,height]);
}


/**
 *  Draws the X axis at the top of the diagram.
 *
 *  @param {*} xScale The scale to use to draw the axis
 */
export function drawXAxis (xScale) {
  d3.select('#viz4 .x.axis')
  	.attr('transform', 'translate(0, -10)')
    .call(d3.axisTop().scale(xScale))
    .select('.domain')
    .remove();
}

/**
 * Draws the Y axis to the right of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 * @param {number} width The width of the graphic
 */
export function drawYAxis (yScale, width) {
  d3.select('#viz4 .y.axis')
	.attr('transform', 'translate(' + width + ',0)')
    .call(d3.axisRight().scale(yScale))
    .select('.domain')
    .remove();
}

/**
 * Rotates the ticks on the X axis 45 degrees towards the left.
 */
 export function rotateXTicks () {
	d3.select('#viz4 .x.axis')
	  .selectAll('.tick text')
	  .attr('transform', 'rotate(-25)');
  }


/**
 * échelle pour le rayon des cercles peuplant la matrice
 *
 * @param {object} data Data de carrière
 * @param {string} mode top_poly ou top_actif
 * @param {int} cote_case_x Cote d'une case sur x dans la matrice
 * @param {int} cote_case_y Cote d'une case sur y dans la matrice
 * @returns {*} Echelle pour le rayon
 */
export function setRadiusScale (data, mode, cote_case_x, cote_case_y) {
	
	let maxCount=0;
	data.forEach(e => {
		if (e[mode].count > maxCount) {
			maxCount = e[mode].count;
		}
	});
	
	const taille_min_cercle = 4
	
	if (cote_case_x > cote_case_y) {
		return d3.scaleLinear().domain([0, maxCount]).range([taille_min_cercle, cote_case_y/2-3]);
	} else {
		return d3.scaleLinear().domain([0, maxCount]).range([taille_min_cercle, cote_case_x/2-3]);
	}	
}


/**
 * Dessine la matrix
 * @param {object} dict_noms_car Dictionnaire reliant un id de nom à une carrière
 * @param {*} yScale vertical y scale of the graph
 * @param {*} xScale horizontal x scale of the graph
 * @param {*} colorScale The ordinal scale used to determine the color of rects
 * @param {number} height The height of the graph
 * @param {number} width The width of the graph
 */
export function updateMatrix (xScale, yScale, colorScale, radiusScale, height, width) {
	
	const cote_case_x = width/ROLES.length
	const cote_case_y = height/NB_NOMS
	
	function setColor(c) {
		if (c[MODE].count > 0) {
			return colorScale(c[MODE].fonction)
		} else {
			return '#ffffff'
		}	
	}
	
	d3.select('#matrix-g')
		.selectAll('.matrix-rect rect')
		.attr('x', c => xScale(c[MODE].fonction))
		.attr('y', c => yScale(c[MODE].nom))
		.attr('width', cote_case_x)
		.attr('height', cote_case_y)
		.attr('fill', "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1);
		
		
	d3.select('#matrix-g')
		.selectAll('.matrix-circle circle')
		.attr('cx', c => xScale(c[MODE].fonction)+cote_case_x/2)
		.attr('cy', c => yScale(c[MODE].nom)+cote_case_y/2)
		.attr("r", c => radiusScale(c[MODE].count))
		.attr('fill', setColor);
}

/**
 * contents of the tooltip for the matrix.
 *
 * @param {object} c Hovered element's data
 * @returns {string} Contents of the tooltip to be displayed
 */
export function getContentsMatrix (c) {
	//retourner juste le nombre de rôles
	return c[MODE].count;
}




(function (d3) {
	const margin_matrix = { top: 70, right: 200, bottom: 80, left: 40 }
	
	let boundsMatrix
	let svgSizeMatrix
	let graphSizeMatrix
	
	const xScale = d3.scaleBand().padding(0.05)
	const yScale = d3.scaleBand().padding(0.2)
	
	const tipMatrix = d3Tip().attr('class', 'd3-tip').html(function (d) { return getContentsMatrix(d) })
	d3.select('.matrix-svg').call(tipMatrix)
	
	let colorScale
	
	//radius scale selon le mode courant
	let dict_radiusScale = {}
	
	//associe nomId aux noms et prénoms
	let dict_nomsId
	
	//associe fonction id au terme de la fonction
	let dict_fonctionId
	
	//associe un id de film ses titre et année de sortie
	let dict_filmoId

	//associe un nom à sa carrière (roles et films)
	let dict_noms_car


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
		
	const g = generateGMatrix(margin_matrix)
	appendAxes(g)
	

	
	//on construit un dict associant nom_id à {nbre de participations , nb de rôles différents effectués}
	var dict_matrix = {}
	Object.keys(dict_noms_car).forEach(nomId => {
		const data_career = dict_noms_car[nomId]
		
		//on compte le nombre de rôles différents
		var set_roles = new Set();
		
		data_career.forEach(c => {
			if (ROLES.includes(c.fonctionCategory)) {
				set_roles.add(c.fonctionCategory)
			}
		})
		
		let roles = Array.from(set_roles);
		const nb_roles = roles.length;
		
		const nb_part = data_career.length
		
		dict_matrix[nomId]={'nb_part':nb_part, 'nb_roles':nb_roles}
	})
	
	let top_noms_actifs=[];
	let top_noms_poly=[];
	
	
	//on extrait les NB_NOMS les plus actifs
	var noms_actifs = Object.keys(dict_matrix).map(function(key) {
	  return [key, dict_matrix[key].nb_part];
	});
	
	let aux_noms_actifs = noms_actifs.sort(function(e1, e2) {
	  return e2[1] - e1[1];
	}).slice(2, NB_NOMS+2)
	.forEach(e => { top_noms_actifs.push(e[0]) });
	
	
	//on construit un dict associant à chaque nom id une carrière précisant le nombre de films par roles
	let dict_top_actifs={}
	top_noms_actifs.forEach(nomId => {
		dict_top_actifs[nomId]={}
		
		const data_career = dict_noms_car[nomId]
		data_career.forEach(c => {
			if (ROLES.includes(c.fonctionCategory)) {
				if (c.fonctionCategory in dict_top_actifs[nomId]) {
					dict_top_actifs[nomId][c.fonctionCategory]+=1
				} else {
					dict_top_actifs[nomId][c.fonctionCategory]=1
				}
			}
		})
	})
	
	
	//on extrait les NB_NOMS  les plus polyvalents
	var noms_poly = Object.keys(dict_matrix).map(function(key) {
		return [key, dict_matrix[key].nb_roles, dict_matrix[key].nb_part];
	});

	let aux_noms_poly = noms_poly.sort(function(e1, e2) {
		if (e2[1] != e1[1]) {
			return e2[1] - e1[1];
		} else {
			//si même nbre de rôles on classe suivant le nombre de participations
			return e2[2] - e1[2];
		}
	}).slice(2, NB_NOMS+2)
	.forEach(e => { top_noms_poly.push(e[0]) });;

	//on construit un dict associant à chaque nom id une carrière précisant le nombre de films par roles
	let dict_top_poly={}
	top_noms_poly.forEach(nomId => {
		dict_top_poly[nomId]={}
		
		const data_career = dict_noms_car[nomId]
		data_career.forEach(c => {
			if (ROLES.includes(c.fonctionCategory)) {
				if (c.fonctionCategory in dict_top_poly[nomId]) {
					dict_top_poly[nomId][c.fonctionCategory]+=1
				} else {
					dict_top_poly[nomId][c.fonctionCategory]=1
				}
			}
		})
	})
	
	var aux_data = []
	
	
	for (const i of Array(NB_NOMS).keys()) {
		aux_data.push([])
		
		const nomId_top_actif = top_noms_actifs[i]
		const nomId_top_poly = top_noms_poly[i]
		
		//on récupère les noms des top_actif et poly
		const nom_top_actif = dict_nomsId[nomId_top_actif].prenom+' '+dict_nomsId[nomId_top_actif].nom
		const nom_top_poly = dict_nomsId[nomId_top_poly].prenom+' '+dict_nomsId[nomId_top_poly].nom
		
		
		ROLES.forEach(role => {
			
			
			let new_element = {}
			
			if (role in dict_top_actifs[nomId_top_actif]) {
				new_element['top_actif']={'nom' : nom_top_actif, 'fonction' : role, 'count' : dict_top_actifs[nomId_top_actif][role]}
			} else {
				new_element['top_actif']={'nom' : nom_top_actif, 'fonction' : role, 'count' : 0}
			}
			
			
			if (role in dict_top_poly[nomId_top_poly]) {
				new_element['top_poly']={'nom' : nom_top_poly, 'fonction' : role, 'count' : dict_top_poly[nomId_top_poly][role]}
			} else {
				new_element['top_poly']={'nom' : nom_top_poly, 'fonction' : role, 'count' : 0}
			}
			
			aux_data[i].push(new_element)
		})	
	}
	
	var data = []
	aux_data.forEach(d =>d.forEach(e => data.push(e)))
	
	
	

	setSizingMatrix()
	
	//taille coté des cases dans la matrice
	const cote_case_x = graphSizeMatrix.width/ROLES.length
	const cote_case_y = graphSizeMatrix.height/NB_NOMS
	
	dict_radiusScale['top_actif'] = setRadiusScale(data, 'top_actif', cote_case_x, cote_case_y)
	dict_radiusScale['top_poly'] = setRadiusScale(data, 'top_poly', cote_case_x, cote_case_y)

	appendRects(data)
	appendCircles(data, tipMatrix, dict_radiusScale)

	buildMatrix()

	d3.select('#viz4 .toggle-button')
		.on('click', () => {
			if (MODE == 'top_poly') {
				MODE = 'top_actif'
				document.getElementById('viz4-description').textContent = 'Personnes les plus actives.'
				document.getElementById('viz4-btn').textContent = 'Voir polyvalence'
			} else {
				MODE = 'top_poly'
				document.getElementById('viz4-description').textContent = 'Personnes ayant exercé le plus de rôles différents.'
				document.getElementById('viz4-btn').textContent = 'Voir activité globale'
			}
			
			buildMatrix()
	})

	

    /**
     *   This function handles the graph's sizing.
     */
    function setSizingMatrix () {
		
	  let graphWidth = Math.min(self.innerWidth, 900);
	  let graphHeight = 530;

      svgSizeMatrix = {
		width: graphWidth,
        height: graphHeight
      }

      graphSizeMatrix = {
        width: svgSizeMatrix.width - margin_matrix.right - margin_matrix.left,
        height: svgSizeMatrix.height - margin_matrix.bottom - margin_matrix.top
      }

      setCanvasSizeMatrix(svgSizeMatrix.width, svgSizeMatrix.height)
    }
	



    /**
     *   This function builds the matrix.
     */
    function buildMatrix () {
		let noms = []
		
		
		if (MODE == 'top_poly') {
			top_noms_poly.map(n => dict_nomsId[n]).forEach(c => noms.push(c.prenom+' '+c.nom))
		} else {
			top_noms_actifs.map(n => dict_nomsId[n]).forEach(c => noms.push(c.prenom+' '+c.nom))
		}
		
		updateXScale (xScale, ROLES, graphSizeMatrix.width)
		updateYScale (yScale, noms, graphSizeMatrix.height)
		
		colorScale = setColorScale()
		
		
		drawXAxis(xScale)
		drawYAxis(yScale, graphSizeMatrix.width)
		
		rotateXTicks()
		updateMatrix(xScale, yScale, colorScale, dict_radiusScale[MODE], graphSizeMatrix.height, graphSizeMatrix.width)
		
    }
	
	
	
}).catch(function(err) {
    console.log('Les .csv n\'ont pas pu être lus');
})

})(d3)