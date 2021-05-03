// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/groups.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roles = exports.groups = exports.colors = void 0;

/*
#00876c
#2c9470
#45a074
#5cad78
#72b97c
#88c580
#9fd184
#b6dd89
#cee98f
#e6f495
#ffff9d
#ffed8a
#fedb79
#fcc86b
#fab560
#f7a258
#f38f52
#ed7b4f
#e7674e
#de534f
#d43d51
*/
var colors = {
  'Acteur': '#8fda59',
  'Production': '#42952e',
  'Technique': '#b3b3b3',
  'Esthetique': '#bfcd8e',
  'Image': '#4cf32c',
  'Son': '#eb46ea',
  'Scénario': '#713d83',
  'Organisme': '#8115b4',
  'Narration': '#e9d737',
  'Documentaire/émission': '#b3b3b3',
  'Science': '#b3b3b3',
  'Régie': '#b3b3b3',
  'Réalisation': '#35618f',
  'Direction artistique': '#9e7ee9',
  'Direction de production': '#34debb',
  'Photographe de plateau': '#da2d82',
  'Générique additionnel': '#828282',
  'Maison de services': '#b3b3b3',
  'Conception': '#b3b3b3',
  'Création': '#b3b3b3'
};
exports.colors = colors;
var groups = {
  24: 'Acteur',
  25: 'Acteur',
  15: 'Acteur',
  28: 'Production',
  29: 'Production',
  48: 'Production',
  4: 'Technique',
  5: 'Technique',
  6: 'Esthetique',
  8: 'Esthetique',
  9: 'Esthetique',
  17: 'Esthetique',
  2: 'Image',
  12: 'Image',
  14: 'Image',
  19: 'Image',
  7: 'Son',
  18: 'Son',
  20: 'Son',
  27: 'Son',
  16: 'Son',
  21: 'Son',
  31: 'Scénario',
  32: 'Scénario',
  33: 'Scénario',
  34: 'Organisme',
  39: 'Organisme',
  40: 'Organisme',
  43: 'Organisme',
  49: 'Organisme',
  37: 'Organisme',
  22: 'Narration',
  23: 'Narration',
  35: 'Documentaire/émission',
  36: 'Documentaire/émission',
  47: 'Documentaire/émission',
  38: 'Science',
  41: 'Science',
  30: 'Régie',
  3: 'Réalisation',
  1: 'Réalisation',
  10: 'Direction artistique',
  11: 'Direction de production',
  26: 'Photographe de plateau',
  13: 'Générique additionnel',
  42: 'Maison de services',
  44: 'Conception',
  45: 'Création'
};
exports.groups = groups;
var roles = {
  1: "Réalisation",
  15: "Interprétation",
  34: "Société de production",
  28: "Producteur",
  14: "Images",
  31: "Scénario",
  37: "Financement",
  24: "Participant",
  19: "Montage images",
  21: "Musique",
  27: "Prise de son",
  43: "Télédiffuseur",
  13: "Générique additionnel",
  2: "Animation",
  29: "Producteur délégué",
  38: "Recherche",
  39: "Société de distribution",
  10: "Direction artistique",
  20: "Montage sonore",
  23: "Narrateur",
  35: "Animateur d'émission",
  18: "Mixage",
  25: "Personnage",
  26: "Photographe de plateau",
  16: "Interprète musique",
  11: "Direction de production",
  48: "Producteur exécutif",
  8: "Costumes",
  7: "Conception sonore",
  32: "Scripte",
  22: "Narration",
  3: "Assistant réalisation",
  17: "Maquillage",
  9: "Décors",
  36: "Journaliste",
  44: "Conception",
  47: "Chroniqueur",
  6: "Coiffure",
  12: "Effets spéciaux",
  30: "Régie",
  40: "Société d'exportation",
  5: "Chef machiniste",
  4: "Chef électricien",
  45: "Création",
  49: "Diffuseur Web",
  42: "Maison de services",
  41: "Laboratoire"
};
exports.roles = roles;
},{}],"src/viz3.js":[function(require,module,exports) {
'use strict';

var groups = _interopRequireWildcard(require("./groups.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
(function (d3) {
  var margin = {
    top: 50,
    right: 80,
    bottom: 50,
    left: 80
  };
  var svgSize, graphSize;
  setSizing();
  var data = [];
  var roleGroups = groups.groups;
  var roleColors = groups.colors;

  function loadViz3(scaleProperty) {
    d3.csv('./data3.csv').then(function (roles) {
      var g = generateG(margin);
      appendAxes(g);
      appendGraphLabels(g);
      positionLabels(g, graphSize.width, graphSize.height);
      var groupOrder = getSortedGroups(roles, roleGroups);
      data = preprocess(roles, roleGroups, true);
      var xScale = setXScale(graphSize.width, data);
      var yScale = setYScale(graphSize.height, data, roleGroups, scaleProperty);
      var colorScale = setColorScale(roleGroups, roleColors);
      var sortedKeys = sortKeys(roleGroups, groupOrder);
      var stackedData = d3.stack().offset(d3.stackOffsetSilhouette).keys(sortedKeys).value(function (d, key) {
        return d[key][scaleProperty];
      })(data);
      drawXAxis(xScale, graphSize.height);
      drawYAxis(yScale);
      var area = d3.area().x(function (d, i) {
        return xScale(d.data.year);
      }).y0(function (d) {
        return yScale(d[0]);
      }).y1(function (d) {
        return yScale(d[1]);
      });
      var Tooltip = g.append("text").attr("x", 0).attr("y", -5).style("opacity", 0).style("font-size", 30).style("margin", "10px");

      var mouseover = function mouseover(d) {
        Tooltip.style("opacity", 1);
        d3.selectAll("#viz3 .myArea").style("opacity", .2).style('stroke-width', '1px');
        d3.selectAll("#viz3 .myArea").filter(function (a) {
          return roleGroups[a.key] == roleGroups[d.key];
        }).style("stroke", "black").style("opacity", 0.6);
        d3.select(this).style("stroke", "black").style("opacity", 1).style('stroke-width', '2px');
      };

      var mousemove = function mousemove(d, i) {
        //console.log( d3.event )
        var text = "";

        if (roleGroups[d.key] != groups.roles[d.key]) {
          text = roleGroups[d.key] + ": " + groups.roles[d.key];
        } else {
          text = roleGroups[d.key];
        }

        Tooltip.text(text);
      };

      var mouseleave = function mouseleave(d) {
        Tooltip.style("opacity", 0);
        d3.selectAll("#viz3 .myArea").style("opacity", 1).style("stroke", "none");
      };

      g.selectAll("layers").data(stackedData).enter().append("path").attr('transform', 'translate( 0, ' + -graphSize.height / 2 + ')').attr("class", "myArea").style("fill", function (d) {
        return colorScale(d.key);
      }).attr("d", area).on("mouseover", mouseover).on("mousemove", mousemove).on("mouseleave", mouseleave);
    });
  }

  loadViz3("count");
  document.getElementById("viz3-button").addEventListener("click", toggleProperty);

  function toggleProperty() {
    var button = document.getElementById("viz3-button");
    var property = button.getAttribute("value");
    d3.select("#viz3").selectAll("*").remove();

    if (property == "count") {
      button.setAttribute("value", "proportion");
      loadViz3("proportion");
      button.innerHTML = "Total";
    } else {
      button.setAttribute("value", "count");
      loadViz3("count");
      button.innerHTML = "Proportion";
    }
  }
  /**
   *   This function handles the graph's sizing.
   */


  function setSizing() {
    var graphWidth = Math.min(self.innerWidth, 1000);
    var graphHeight = graphWidth * 0.6;
    svgSize = {
      width: graphWidth,
      height: graphHeight
    };
    graphSize = {
      width: svgSize.width - margin.right - margin.left,
      height: svgSize.height - margin.bottom - margin.top
    };
    setCanvasSize(svgSize.width, svgSize.height);
  }
})(d3);

function preprocess(roles, groups) {
  var data = [];
  var emptyGroups = {};
  Object.keys(groups).forEach(function (key) {
    emptyGroups[key] = 0;
  });
  var thisYear = new Date().getFullYear();
  var yearLimit = thisYear - 5 - (thisYear - 5) % 5 - 1;
  roles.forEach(function (element) {
    var roleId = parseInt(element.role.substr(44));
    var year = element.year - element.year % 5;

    if (year <= yearLimit) {
      if (!data.find(function (d) {
        return d.year == year;
      })) {
        var row = {
          'year': year
        };
        Object.keys(groups).forEach(function (key) {
          row[key] = 0;
        });
        data.push(row);
      }

      data.find(function (d) {
        return d.year == year;
      })[roleId] = parseInt(element.count);
    }
  });
  data.forEach(function (d) {
    var yearSum = 0;
    Object.keys(groups).forEach(function (g) {
      yearSum += d[g];
    });
    Object.keys(groups).forEach(function (g) {
      d[g] = {
        'count': d[g],
        'proportion': d[g] / yearSum
      };
    });
  });
  return data;
}

function setXScale(width, data) {
  return d3.scaleLinear().domain(d3.extent(data, function (d) {
    return d.year;
  })).range([0, width]);
}

function setYScale(height, data, roleGroups, scaleProperty) {
  var range = 0;
  data.forEach(function (d) {
    var rolesSum = 0;
    Object.keys(roleGroups).forEach(function (key) {
      if (d[key][scaleProperty]) {
        rolesSum += d[key][scaleProperty];
      }
    });

    if (rolesSum > range) {
      range = rolesSum;
    }
  });
  return d3.scaleLinear().domain([0, range]).range([height, 0]);
}

function setColorScale(roleGroups, groupsColors) {
  var domain = [];
  var colors = [];
  Object.entries(roleGroups).forEach(function (r) {
    domain.push(r[0]);
    colors.push(groupsColors[r[1]]);
  });
  return d3.scaleOrdinal().domain(domain).range(colors);
}
/**
 * Draws the X axis at the bottom of the diagram.
 *
 * @param {*} xScale The scale to use to draw the axis
 * @param {number} height The height of the graphic
 */


function drawXAxis(xScale, height) {
  d3.select('#viz3 .x.axis').attr('transform', 'translate( 0, ' + height + ')').call(d3.axisBottom(xScale).tickSizeOuter(0).tickFormat(d3.format("d"))); //.tickArguments([5, '~s']))
}
/**
 * Draws the Y axis to the left of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 */


function drawYAxis(yScale) {
  d3.select('#viz3 .y.axis').call(d3.axisLeft(yScale).tickSizeOuter(0).tickArguments([5, '.0r']));
}

function getSortedGroups(data, groups) {
  var groupTotals = {};
  data.forEach(function (d) {
    var roleId = parseInt(d.role.substr(44));

    if (!groupTotals[groups[roleId]]) {
      groupTotals[groups[roleId]] = 0;
    }

    groupTotals[groups[roleId]] += parseInt(d.count);
  });
  return Object.entries(groupTotals).sort(function (a, b) {
    return b[1] - a[1];
  }).map(function (e) {
    return e[0];
  });
}

function sortKeys(roles, order) {
  var sortedKeys = Object.entries(roles).sort(function (a, b) {
    var indexa = order.findIndex(function (r) {
      return r == a[1];
    });
    var indexb = order.findIndex(function (r) {
      return r == b[1];
    });

    if (indexa < indexb) {
      return -1;
    }

    if (indexa > indexb) {
      return 1;
    }

    return 0;
  }).map(function (e) {
    return e[0];
  });
  return sortedKeys;
}

function appendAxes(g) {
  g.append('g').attr('class', 'x axis');
  g.append('g').attr('class', 'y axis');
}

function appendGraphLabels(g) {
  g.append('text').text('Année').attr('class', 'x axis-text').attr('font-size', 20);
}

function positionLabels(g, width, height) {
  // TODO : Position axis labels
  d3.select('#viz3 .y.axis-text').attr('x', -48).attr('y', height / 2);
  d3.select('#viz3 .x.axis-text').attr('x', width / 2).attr('y', height + 40);
}

function generateG(margin) {
  return d3.select('.graph-viz3').select('svg').append('g').attr('id', 'graph-g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}

function setCanvasSize(width, height) {
  d3.select('#viz3').attr('width', width).attr('height', height);
}
},{"./groups.js":"src/groups.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62014" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/viz3.js"], null)
//# sourceMappingURL=/viz3.112b2779.js.map