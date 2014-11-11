$(function() {

    var years;

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category20();

    var voronoi = d3.geom.voronoi()
        .x(function(d) {
            return x(d.year);
        })
        .y(function(d) {
            return y(d.value);
        })
        .clipExtent([
            [-margin.left, -margin.top],
            [width + margin.right, height + margin.bottom]
        ]);

    var line = d3.svg.line()
        .x(function(d) {
            return x(d.year);
        })
        .y(function(d) {
            return y(d.value);
        });

    var svg = d3.select("#lineplot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function massage(d, i) {

        if(!i) {
            years = Object.keys(d).filter(Number);
        }
        var country = {
            name: d.country,
            values: null
        };
        country.values = Object.keys(d).filter(Number).map(function(year) {
            return {
                country: country,
                year: year,
                value: Math.round(d[year])
            };
        });

        return country;
    }

    d3.csv("assets/data/celldata.csv", massage, function(error, rows) {


        x.domain(d3.extent(years));
        y.domain([0, d3.max(rows, function(c) {
            return d3.max(c.values, function(d) {
                return d.value;
            });
        })]).nice();

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis()
                .scale(x)
                .orient("bottom"));

        svg.append("g")
            .attr("class", "axis axis--y")
            .call(d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10, "%"))
            .append("text")
            .attr("x", 4)
            .attr("dy", ".32em")
            .style("font-weight", "bold")
            .text("Unemployment Rate");

        svg.append("g")
            .attr("class", "cities")
            .selectAll("path")
            .data(rows)
            .enter().append("path")
            .attr("d", function(d) {

                d.line = this;

                return line(d.values);

            });

        var focus = svg.append("g")
            .attr("transform", "translate(-100,-100)")
            .attr("class", "focus");

        focus.append("circle")
            .attr("r", 3.5);

        focus.append("text")
            .attr("y", -10);


        var voronoiGroup = svg.append("g")
            .attr("class", "voronoi");

        voronoiGroup.selectAll("path")
            .data(voronoi(d3.nest()
                .key(function(d) {
                    return x(d.date) + "," + y(d.value);
                })
                .rollup(function(v) {
                    return v[0];
                })
                .entries(d3.merge(rows.map(function(d) {
                    return d.values;
                })))
                .map(function(d) {
                    return d.values;
                })))
            .enter().append("path")
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .datum(function(d) {
                return d.point;
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        /*
         d3.select("#show-voronoi")
         .property("disabled", false)
         .on("change", function() { voronoiGroup.classed("voronoi--show", this.checked); });

         */
        function mouseover(d) {
            d3.select(d.country.line).classed("city--hover", true);
            d.country.line.parentNode.appendChild(d.country.line);
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
            focus.select("text").text(d.country.name);
        }

        function mouseout(d) {
            d3.select(d.country.line).classed("city--hover", false);
            focus.attr("transform", "translate(-100,-100)");
        }
    });


});