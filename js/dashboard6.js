/**
 * Created by Sophie on 4/4/2015.
 */
var dashboard6 = (function () {
    var chart;
    function createImage()
    {
        function canvas(id, fData){
            var barColor = 'steelblue';
            var barColor2 = 'pink';
            function segColor(c){ return {Queit:"#72f56c", Average:"#6c77f5",Loud:"#f7af6c",VeryLoud:"#f76c73"}[c]; }
            var barColorSet=["#5ea8ba","#915cb4"];
            // compute total for each state.
            fData.forEach(function(d){
                d.total= d.Noise.Queit+ d.Noise.Average+ d.Noise.Loud+ d.Noise.VeryLoud;
            });


            // function to handle histogram.
            function histoGram(fD){
                var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
                hGDim.w = 500 - hGDim.l - hGDim.r,
                    hGDim.h =290 - hGDim.t - hGDim.b;
                var ColorData=[{Name:"Chinese Restaruant",Value:0},{Name:"Non Chinese Restaruant",Value:1}];
                //create svg for histogram.
                var hGsvg = d3.select(id).append("svg")
                    .attr("width", hGDim.w + hGDim.l + hGDim.r)
                    .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
                    .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

                var legend=hGsvg.selectAll(".legend")
                    .data(ColorData)
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
                legend.append("rect")
                    .attr("x", hGDim.w - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", function(d){return barColorSet[d.Value]});

                legend.append("text")
                    .attr("x",hGDim.w - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function(d) { return d.Name; });

                // create function for x-axis mapping.
                var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                    .domain(fD.map(function(d) {
                        return d[0];
                    }));

                // Add x-axis to the histogram svg.
                hGsvg.append("g").attr("class", "x axis")
                    .attr("transform", "translate(0," + hGDim.h + ")")
                    .call(d3.svg.axis().scale(x).orient("bottom"));

                // Create function for y-axis map.
                var y = d3.scale.linear().range([hGDim.h, 0])
                    .domain([0, d3.max(fD, function(d) { return d[1]; })]);

                // Create bars for histogram to contain rectangles and freq labels.
                var bars = hGsvg.selectAll(".bar").data(fD).enter()
                    .append("g").attr("class", "bar");

                //create the rectangles.
                bars.append("rect")
                    .attr("x", function(d) { return x(d[0]); })
                    .attr("y", function(d) { return y(d[1]); })
                    .attr("width", x.rangeBand())
                    .attr("height", function(d) { return hGDim.h - y(d[1]); })
                    .attr('fill',function(d) { return barColorSet[d[2]] ;})
                    .on("mouseover",mouseover)// mouseover is defined below.
                    .on("mouseout",mouseout);// mouseout is defined below.


                //Create the frequency labels above the rectangles.
                bars.append("text").text(function(d){ return d3.format(",")(d[1])})
                    .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
                    .attr("y", function(d) { return y(d[1])-5; })
                    .attr("text-anchor", "middle");


                function mouseover(d){  // utility function to be called on mouseover.
                    // filter for selected state.
                    var st = fData.filter(function(s){ return s.City == d[0];})[0],
                        nD = d3.keys(st.Noise).map(function(s){ return {type:s, Noise:st.Noise[s]};});

                    // call update functions of pie-chart and legend.
                    pC.update(nD);
                    leg.update(nD);
                }

                function mouseout(d){    // utility function to be called on mouseout.
                    // reset the pie-chart and legend.
                    pC.update(tF);
                    leg.update(tF);
                }

                // create function to update the bars. This will be used by pie-chart.
                hG.update = function(nD, color){
                    // update the domain of the y-axis map to reflect change in frequencies.
                    y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

                    // Attach the new data to the bars.
                    var bars = hGsvg.selectAll(".bar").data(nD);

                    // transition the height and color of rectangles.
                    bars.select("rect").transition().duration(500)
                        .attr("y", function(d) {return y(d[1]); })
                        .attr("height", function(d) { return hGDim.h - y(d[1]); })
                        .attr("fill", color);

                    // transition the frequency labels location and change value.
                    bars.select("text").transition().duration(500)
                        .text(function(d){ return d3.format(",")(d[1])})
                        .attr("y", function(d) {return y(d[1])-5; });
                }
                hG.recover = function(nD, color){
                    // update the domain of the y-axis map to reflect change in frequencies.
                    y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

                    // Attach the new data to the bars.
                    var bars = hGsvg.selectAll(".bar").data(nD);

                    // transition the height and color of rectangles.
                    bars.select("rect").transition().duration(500)
                        .attr("y", function(d) {return y(d[1]); })
                        .attr("height", function(d) { return hGDim.h - y(d[1]); })
                        .attr("fill", function(d) { return barColorSet[d[2]] ;});

                    // transition the frequency labels location and change value.
                    bars.select("text").transition().duration(500)
                        .text(function(d){ return d3.format(",")(d[1])})
                        .attr("y", function(d) {return y(d[1])-5; });
                }
                return hG;
            }

            // function to handle pieChart.
            function pieChart(pD){
                var pC ={},    pieDim ={w:170, h: 170};
                pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

                // create svg for pie chart.
                var piesvg = d3.select(id).append("svg")
                    .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
                    .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

                // create function to draw the arcs of the pie slices.
                var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

                // create a function to compute the pie slice angles.
                var pie = d3.layout.pie().sort(null).value(function(d) { return d.Noise; });

                // Draw the pie slices.
                piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
                    .each(function(d) { this._current = d; })
                    .style("fill", function(d) { return segColor(d.data.type); })
                    .on("mouseover",mouseover).on("mouseout",mouseout);

                // create function to update pie-chart. This will be used by histogram.
                pC.update = function(nD){
                    piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                        .attrTween("d", arcTween);
                }
                // Utility function to be called on mouseover a pie slice.
                function mouseover(d){
                    // call the update function of histogram with new data.
                    hG.update(fData.map(function(v){
                        return [v.City,v.Noise[d.data.type]];}),segColor(d.data.type));
                }
                //Utility function to be called on mouseout a pie slice.
                function mouseout(d){
                    // call the update function of histogram with all data.
                    hG.recover(fData.map(function(v){
                        col= v.Chinese;
                        return [v.City,v.total, v.Chinese];}));
                }
                // Animating the pie-slice requiring a custom function which specifies
                // how the intermediate paths should be drawn.
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function(t) { return arc(i(t));    };
                }
                return pC;
            }

            // function to handle legend.
            function legend(lD){
                var leg = {};

                // create table for legend.
                var legend = d3.select(id).append("table").attr('class','legend');

                // create one row per segment.
                var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

                // create the first column for each segment.
                tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
                    .attr("width", '16').attr("height", '16')
                    .attr("fill",function(d){ return segColor(d.type); });

                // create the second column for each segment.
                tr.append("td").text(function(d){ return d.type;});

                // create the third column for each segment.
                tr.append("td").attr("class",'legendFreq')
                    .text(function(d){ return d3.format(",")(d.Noise);});

                // create the fourth column for each segment.
                tr.append("td").attr("class",'legendPerc')
                    .text(function(d){ return getLegend(d,lD);});

                // Utility function to be used to update the legend.
                leg.update = function(nD){
                    // update the data attached to the row elements.
                    var l = legend.select("tbody").selectAll("tr").data(nD);

                    // update the frequencies.
                    l.select(".legendFreq").text(function(d){ return d3.format(",")(d.Noise);});

                    // update the percentage column.
                    l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
                }

                function getLegend(d,aD){ // Utility function to compute percentage.
                    return d3.format("%")(d.Noise/d3.sum(aD.map(function(v){ return v.Noise; })));
                }

                return leg;
            }

            // calculate total frequency by segment for all state.
            var tF = ['Queit','Average','Loud','VeryLoud'].map(function(d){
                return {type:d, Noise: d3.sum(fData.map(function(t){ return t.Noise[d];})) };
            });

            // calculate total frequency by state for all segment.
            var sF = fData.map(function(d){return [d.City,d.total, d.Chinese];});

            var hG = histoGram(sF), // create the histogram.
                pC = pieChart(tF), // create the pie-chart.
                leg= legend(tF);  // create the legend.

        }

        var freqData=[
            {
                "City": "Phoenix0","Noise":{"Queit": 34, "Average": 112, "Loud": 12, "VeryLoud": 4},"Chinese":0
            },
            {
                "City": "Phoenix1","Noise":{"Queit": 68, "Average": 85, "Loud": 3, "VeryLoud": 4},"Chinese":1
            },
            {
                "City": "Mesa0","Noise":{"Queit": 7, "Average": 30, "Loud": 4, "VeryLoud": 0},"Chinese":0
            },
            {
                "City": "Mesa1","Noise":{"Queit": 30, "Average": 17, "Loud": 4, "VeryLoud": 0},"Chinese":1
            },
            {
                "City": "Chandler0","Noise":{"Queit": 6, "Average": 22, "Loud": 2, "VeryLoud": 0},"Chinese":0
            },
            {
                "City": "Chandler1","Noise":{"Queit": 15, "Average": 30, "Loud": 1, "VeryLoud": 2},"Chinese":1
            },
            {
                "City": "Scottsdale0","Noise":{"Queit": 21, "Average": 50, "Loud": 1, "VeryLoud": 1},"Chinese":0
            },
            {
                "City": "Scottsdale1", "Noise":{"Queit": 10, "Average": 22, "Loud": 2, "VeryLoud": 1},"Chinese":1
            },
            {
                "City": "Tempe0","Noise":{"Queit": 6, "Average": 11, "Loud": 2, "VeryLoud": 0},"Chinese":0
            },
            {
                "City": "Tempe1", "Noise":{"Queit": 13, "Average": 17, "Loud": 1, "VeryLoud": 0},"Chinese":1
            }
        ];

        canvas('#canvas',freqData);

    }

    function render() {

        var html =
        '<link href="css/barpie.css" rel="stylesheet">'+
            '<h1 align="center">Noise Level</h1>' +
            '<div id="canvas">' +
            '</div>'

        $("#content").html(html);

        chart = createImage();
    }

    return {
        render: render
    }

}());