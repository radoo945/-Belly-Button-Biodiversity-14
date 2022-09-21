d3.json('samples.json').then((incomingData) => {

    var data = incomingData;
    
    //Plotting data to the drop down menu
   var dropdown = d3.select("#selDataset");

    var subID = data.names;

    subID.forEach((names) => {

        var option = dropdown.append("option");
        option.text(names);
    });

    //Setting Default screen ouptut
    var defaultID = subID[0];
    getMetaData(defaultID);
    plots(defaultID);

    //Function to get the data for the respective ID
    function getMetaData(ID){

        var metaData = data.metadata;

        var filteredData = {};

        //For loop to go over the array to get the data for the corresponding ID
        for (let i = 0; i<metaData.length;i++) {

            if(metaData[i].id == ID){
                filteredData = metaData[i];
                break;
            }
        }

        //Adding data to the body
        var body = d3.select("#sample-metadata");
        body.html("");
        for (let [key, value] of Object.entries(filteredData)) {
            body.append("p").text(`${key}: ${value}`);
          }
    }

    function plots(ID){

        //Getting the sample Data
        var sampleData = data.samples;

        var filteredData = [];

        //Filtering out the data for the specific ID
        for (var i = 0; i < sampleData.length; i++){

            if(sampleData[i].id == ID){
                filteredData.push(sampleData[i]);
                break;
            }
        };

        console.log(filteredData);

        var otuIds = [];
        var sampleValues = [];
        var otuLabels = [];
        var colorIDs = [];

        //Getting the top 10 otu ids for the chosen ID
        for(var i = 0; i < 10; i++){
                otuIds.push(filteredData[0].otu_ids[i]);
                colorIDs.push(filteredData[0].otu_ids[i]);
                sampleValues.push(filteredData[0].sample_values[i]);
                otuLabels.push(filteredData[0].otu_labels[i]);

        };

        //Appending OTU at the start of the ID's
        for (var j =0; j < otuIds.length; j++){
            otuIds[j] = 'OTU ' + otuIds[j];
        };

        //Bar Plot
        var barData = [{
            type: 'bar',
            x: sampleValues.reverse(),
            y: otuIds.reverse(),
            orientation: 'h',
            text: otuLabels.reverse()
        }];

        var barLayout = {
            yaxis:{range: otuIds, width: 400},
        };

        //Adding plot to the html page
        Plotly.newPlot('bar', barData, barLayout);

        //Bubble Plot
        var bubbleData = [{
            type: 'scatter',
            mode: 'markers',
            x: colorIDs,
            y: sampleValues,
            marker: {
                size: sampleValues,
                color: colorIDs
            },
            hovertext: otuLabels
        }];

        var bubbleLayout = {
            height: 600,
            width: 1000
        };

        //Adding plot to the html page
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        //Getting data for the guage plot
        var gaugeData = data.metadata;

        var scrubing = 0;

        for (var k = 0; k < gaugeData.length; k++){
            if(gaugeData[k].id == ID){
                scrubing = (gaugeData[k].wfreq);
            }
        };

        console.log(scrubing);

        var gaugePlot = [{
            domain: { x: [0, 1], y: [0, 1] },
		    value: scrubing,
		    title: { text: "Belly Button Washing Frequency" },
		    type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                  { range: [0, 1], color: "antiqueWhite" },
                  { range: [1, 2], color: "lightyellow" },
                  {range: [2, 3], color: "moccasin" },
                  {range: [3, 4], color: "wheat" },
                  {range: [4, 5], color: "palegreen" },
                  {range: [5, 6], color: "lightgreen" },
                  {range: [6, 7], color: "darkseagreen" },
                  {range: [7, 8], color: "seagreen" },
                  {range: [8, 9], color: "mediumseagreen" }
                ],
                threshold: {
                  line: { color: "red", width: 5 },
                  thickness: 0.75,
                  value: scrubing
                }
              }
        }];

        var gaugeLayout= {
            width: 600,
            height: 500,
            margin: {t: 0, b: 0}
        };

        Plotly.newPlot("gauge", gaugePlot, gaugeLayout);
    }

    //Calling the function to change if the value in drop down menu changes
   d3.select("select").on("change",function(d){
       var selected = d3.select("#selDataset").node().value;
       console.log(selected);
       getMetaData(selected);
       plots(selected);

   });
});