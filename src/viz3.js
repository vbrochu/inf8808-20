'use strict'

import * as groups from './groups.js'

/*
BASE <http://data.cinematheque.qc.ca>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX frbroo: <http://iflastandards.info/ns/fr/frbr/frbroo/>
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>

SELECT ?role ?roleLabel ?year (count(?role) as ?count) WHERE {
  ?publicProjectionEvent crm:P16_used_specific_object ?publicationExpression .
  ?publicationExpression crm:P165_incorporates ?recording .
  ?recordingEvent frbroo:R21_created ?recording .
  ?recordingEvent crm:P9_consists_of ?recordingActivity .
  ?recordingEvent frbroo:R22_created_a_realization_of ?recordingWork .
  ?recordingWork frbroo:R2_is_derivative_of ?work .
  ?work crm:P102_has_title ?workTitle .
  FILTER (contains(str(?work), "http://data.cinematheque.qc.ca") && contains(str(?workTitle),"OriginalTitleWork"))
  ?recordingActivityCarriedOutBy crm:P01_has_domain ?recordingActivity .
  ?recordingActivityCarriedOutBy crm:P14.1_in_the_role_of ?role .
  ?role rdfs:label ?roleLabel .
  
  ?publicProjectionEvent crm:P4_has_time-span ?timespan .
  ?timespan crm:P82a_begin_of_the_begin ?releaseBegin .
  ?timespan crm:P79_beginning_is_qualified_by ?releaseBegin .
  ?timespan crm:P80_end_is_qualified_by ?releaseEnd .
  
  BIND(year(?releaseBegin) as ?year)
  BIND(year(?releaseEnd) as ?year)
}
GROUP BY ?role ?roleLabel ?year
ORDER BY ?year ?roleLabel
*/

(function(d3) {
    let margin = {
        top: 50,
        right: 80,
        bottom: 50,
        left: 80
    }

    let svgSize, graphSize

    setSizing()



    let data = [];
    let roleGroups = groups.groups;
    let roleColors = groups.colors

    function loadViz3(scaleProperty) {
        d3.csv('./data3.csv').then((roles) => {
            let g = generateG(margin)

            appendAxes(g)
            appendGraphLabels(g)

            positionLabels(g, graphSize.width, graphSize.height)

            let groupOrder = getSortedGroups(roles, roleGroups);
            data = preprocess(roles, roleGroups, true);

            let xScale = setXScale(graphSize.width, data);
            let yScale = setYScale(graphSize.height, data, roleGroups, scaleProperty);
            let colorScale = setColorScale(roleGroups, roleColors);

            let sortedKeys = sortKeys(roleGroups, groupOrder);

            var stackedData = d3.stack()
                .offset(d3.stackOffsetSilhouette)
                .keys(sortedKeys)
                .value((d, key) => d[key][scaleProperty])
                (data);

            drawXAxis(xScale, graphSize.height)
            drawYAxis(yScale)

            let area = d3.area()
                .x(function(d, i) {
                    return xScale(d.data.year);
                })
                .y0(function(d) {
                    return yScale(d[0]);
                })
                .y1(function(d) {
                    return yScale(d[1]);
                });

            var Tooltip = g
                .append("text")
                .attr("x", 0)
                .attr("y", -5)
                .style("opacity", 0)
                .style("font-size", 30)
                .style("margin", "10px");

            var mouseover = function(d) {
                Tooltip.style("opacity", 1)
                d3.selectAll("#viz3 .myArea").style("opacity", .2)
                    .style('stroke-width', '1px');
                d3.selectAll("#viz3 .myArea")
                    .filter(a => roleGroups[a.key] == roleGroups[d.key])
                    .style("stroke", "black")
                    .style("opacity", 0.6);
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
                    .style('stroke-width', '2px');
            }
            var mousemove = function(d, i) {
                //console.log( d3.event )
                let text = "";
                if (roleGroups[d.key] != groups.roles[d.key]) {
                    text = roleGroups[d.key] + ": " + groups.roles[d.key];
                } else {
                    text = roleGroups[d.key];
                }

                Tooltip.text(text)
            }
            var mouseleave = function(d) {
                Tooltip.style("opacity", 0)
                d3.selectAll("#viz3 .myArea").style("opacity", 1).style("stroke", "none")
            }

            g.selectAll("layers")
                .data(stackedData)
                .enter()
                .append("path")
                .attr('transform', 'translate( 0, ' + -graphSize.height / 2 + ')')
                .attr("class", "myArea")
                .style("fill", function(d) {
                    return colorScale(d.key);
                })
                .attr("d", area)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
        })
    }

    loadViz3("count")

    document.getElementById("viz3-button").addEventListener("click", toggleProperty);

    function toggleProperty() {
        let button = document.getElementById("viz3-button");
        let property = button.getAttribute("value")

        d3.select("#viz3").selectAll("*").remove();

        if (property == "count") {
            button.setAttribute("value", "proportion")
            loadViz3("proportion");
            button.innerHTML = "Total"
        } else {
            button.setAttribute("value", "count")
            loadViz3("count");
            button.innerHTML = "Proportion"
        }
    }

    /**
     *   This function handles the graph's sizing.
     */
    function setSizing() {
        let graphWidth = 800;
        let graphHeight = 500;

        svgSize = {
            width: graphWidth,
            height: graphHeight
        }

        graphSize = {
            width: svgSize.width - margin.right - margin.left,
            height: svgSize.height - margin.bottom - margin.top
        }

        setCanvasSize(svgSize.width, svgSize.height)
    }
})(d3)

function preprocess(roles, groups) {
    let data = []
    let emptyGroups = {};
    Object.keys(groups).forEach(key => {
        emptyGroups[key] = 0;
    })

    let thisYear = new Date().getFullYear();
    let yearLimit = ((thisYear - 5) - (thisYear - 5) % 5) - 1;

    roles.forEach(element => {
        let roleId = parseInt(element.role.substr(44));
        let year = element.year - element.year % 5;
        if (year <= yearLimit) {
            if (!data.find(d => d.year == year)) {
                let row = {
                    'year': year
                };
                Object.keys(groups).forEach(key => {
                    row[key] = 0;
                })
                data.push(row);
            }

            data.find(d => d.year == year)[roleId] = parseInt(element.count);
        }
    });
    data.forEach(d => {
        let yearSum = 0;
        Object.keys(groups).forEach(g => {
            yearSum += d[g];
        });

        Object.keys(groups).forEach(g => {
            d[g] = {
                'count': d[g],
                'proportion': d[g] / yearSum
            };
        });
    })
    return data;
}

function setXScale(width, data) {
    return d3.scaleLinear()
        .domain(d3.extent(data, function(d) {
            return d.year;
        }))
        .range([0, width]);
}

function setYScale(height, data, roleGroups, scaleProperty) {
    let range = 0;

    data.forEach(d => {
        let rolesSum = 0;
        Object.keys(roleGroups).forEach(key => {
            if (d[key][scaleProperty]) {
                rolesSum += d[key][scaleProperty];
            }
        })
        if (rolesSum > range) {
            range = rolesSum;
        }
    });

    return d3.scaleLinear()
        .domain([0, range])
        .range([height, 0]);
}

function setColorScale(roleGroups, groupsColors) {
    let domain = [];
    let colors = [];
    Object.entries(roleGroups).forEach(r => {
        domain.push(r[0]);
        colors.push(groupsColors[r[1]]);
    });
    return d3.scaleOrdinal()
        .domain(domain)
        .range(colors);
}

/**
 * Draws the X axis at the bottom of the diagram.
 *
 * @param {*} xScale The scale to use to draw the axis
 * @param {number} height The height of the graphic
 */
function drawXAxis(xScale, height) {
    d3.select('#viz3 .x.axis')
        .attr('transform', 'translate( 0, ' + height + ')')
        .call(d3.axisBottom(xScale).tickSizeOuter(0).tickFormat(d3.format("d"))) //.tickArguments([5, '~s']))
}

/**
 * Draws the Y axis to the left of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 */
function drawYAxis(yScale) {
    d3.select('#viz3 .y.axis')
        .call(d3.axisLeft(yScale).tickSizeOuter(0).tickArguments([5, '.0r']))
}

function getSortedGroups(data, groups) {
    let groupTotals = {};
    data.forEach(d => {
        let roleId = parseInt(d.role.substr(44));
        if (!groupTotals[groups[roleId]]) {
            groupTotals[groups[roleId]] = 0;
        }
        groupTotals[groups[roleId]] += parseInt(d.count);
    })

    return Object.entries(groupTotals).sort((a, b) => b[1] - a[1]).map(e => e[0]);
}

function sortKeys(roles, order) {
    let sortedKeys = Object.entries(roles).sort((a, b) => {
        let indexa = order.findIndex(r => r == a[1]);
        let indexb = order.findIndex(r => r == b[1]);
        if (indexa < indexb) {
            return -1;
        }
        if (indexa > indexb) {
            return 1;
        }
        return 0;
    }).map(e => e[0]);
    return sortedKeys;
}

function appendAxes(g) {
    g.append('g')
        .attr('class', 'x axis');
    g.append('g')
        .attr('class', 'y axis');
}

function appendGraphLabels(g) {
    g.append('text')
        .text('Ann??e')
        .attr('class', 'x axis-text')
        .attr('font-size', 20)
}

function positionLabels(g, width, height) {
    // TODO : Position axis labels
    d3.select('#viz3 .y.axis-text')
        .attr('x', -48)
        .attr('y', height / 2)

    d3.select('#viz3 .x.axis-text')
        .attr('x', width / 2)
        .attr('y', height + 40)
}

function generateG(margin) {
    return d3.select('.graph-viz3')
        .select('svg')
        .append('g')
        .attr('id', 'graph-g')
        .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')')
}

function setCanvasSize(width, height) {
    d3.select('#viz3')
        .attr('width', width)
        .attr('height', height)
}