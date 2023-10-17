// FOR THE RECORD I CANNOT STAND THIS JAVASCRIPT LANGUAGE AND HAD TO COMMENT DANG NEAR EVERY LINE TO MAKE SURE I WAS NOT MUCKING SOMETHING UP.


// Start by constructing the dropdown menu and populating with subject ids

//  Datasource!
var source = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


function initialize() {
    //  'data' is whatever is returned following successful execution of the d3.jason() component, then is passed to the .then() statement
    d3.json(source).then(data => {
        console.log("Dataset for viewing in log...", data);
/*
    'data' format as follows...
        metadata: Array
            Object
                age: 24
                bbtype: "I"
                ethnicity: "Caucasian"
                gender: "F"
                id: 940
                location: "Beaufort/NC"
                wfreq: 2
        names: Array
            Object
                just a series of strings and their index
        samples: Array
            Object
                id: "940"
                otu_ids: [1167, 2859, 482, 2264, 41, 1189, 352, 189, 2318, 1977, …]
                otu_labels: ["Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas"...]
                sample_values: 163
*/

        var sampleIds = data.names; // Creates a variable with the values from the 'names' array in it, the IDs to select from
        var dropdownMenu = d3.select("#selDataset"); // Target the section of HTML code with a <select> tag id = selDataset
        // as a reminder, <select> indicates a dropdown menu object
        sampleIds.forEach(sampleId => {
            dropdownMenu.append("option").property("value", sampleId).text(sampleId);
        }); // Loop through the full array of sampleIds and append each to the target of that particular <select>(ie: dropdown menu) statement id
            // The 'names' array is 1D in nature so a column discriminator is not necessary, wee.
        
        /* It should result in a series of html-format statements that will comprise the dropdown menu values like this...
        <select id="selDataset" onchange="optionChanged(this.value)">
            <option value="1">Sample name 1</option>
            <option value="2">Sample name 2</option>
            <option value="3">Sample name 3</option>
            ...
        </select>
        */

        var initialSampleId = sampleIds[0]; // Build charts and such with the first value in the resulting 1D sample data array
        // This is important to construct as to pass an initial value to the build functions that follow
        // Otherwise the dropdown menu will populate and display a value, but nothing will be constructed
        // On change to another value it will work as intended, but that makes for poor UX
        buildCharts(initialSampleId);
        buildMetadata(initialSampleId);
        // Calls on the charts and medatdata constructos functions! \o/... defined below, obv.
    });
}


// Chart building funtime, all at once!
function buildCharts(sampleId) {
    // Gather data for chart construction... 
    // sampleID comes in from the call presented later that changes as a triggered on-screen event fires (whatever the dropdown menu value is)
    // The whole cluster that follows is a call to the d3 library and uses the output from the call to source, same as before
    d3.json(source).then(data => {
        
        // The whole dataset is returned to 'data', the following selects the 'samples' Array Object
        // The filter creates an array called 'sample', where the s
        
        var sampleData = data.samples.filter(sample => sample.id === sampleId)[0];
        //  Why not at the beginning with id:0, gotta start somewhere~
        //Bar Chart!
        var barData = {
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: sampleData.otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };
        Plotly.newPlot("bar", [barData]);

        // Making a bubble chart
        var bubbleData = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Earth"
            }
        };
        Plotly.newPlot("bubble", [bubbleData]);

        // Making a dial chart
        var weeklyScrubs = data.metadata.filter(meta => meta.id == sampleId)[0].wfreq;
        var dialData = [
            {
                type: "indicator",
                mode: "gauge",
                value: weeklyScrubs,
                title: {
                    text: "<b>Belly Button Washing Frequency</b><br><span style='font-size:0.8em;color:gray'>Scrubs per Week</span>",
                    font: { size: 18 }
                },
                gauge: {
                    axis: 
                        { 
                            range: [null, 9], 
                            tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                            ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
                            tickmode: "array", 
                            tickangle: 45 
                        },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 1], color: "rgba(240, 234, 214, 0.7)" }, // Eggshell
                        { range: [1, 2], color: "rgba(238, 246, 220, 0.7)" },
                        { range: [2, 3], color: "rgba(218, 234, 185, 0.7)" },
                        { range: [3, 4], color: "rgba(184, 206, 152, 0.7)" },
                        { range: [4, 5], color: "rgba(158, 201, 154, 0.7)" },
                        { range: [5, 6], color: "rgba(134, 186, 150, 0.7)" },
                        { range: [6, 7], color: "rgba(109, 171, 146, 0.7)" },
                        { range: [7, 8], color: "rgba(78, 157, 143, 0.7)" },
                        { range: [8, 9], color: "rgba(34, 139, 34, 0.7)" } // Forest Green
                    ],
                    threshold: {
                        line: { color: "red", width: 4 },
                        thickness: 0.75,
                        value: weeklyScrubs
                    },
                    shape: "needle",
                    needle: {
                        thickness: 0.5,
                        length: 50,
                        value: weeklyScrubs
                    }
                }
            }
        ];

        var dialLayout = {
            width: 400,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            font: { color: "black", family: "Arial" },
            annotations: [
                {
                    showarrow: true,
                    arrowhead: 50
                }
              ]
        };

        Plotly.newPlot("gauge", dialData, dialLayout);

    });
    
}

// Function to display sample metadata
function buildMetadata(sampleId) {
    // Fetch metadata from the provided URL
    d3.json(source).then(data => {
        var metadata = data.metadata;
        // Filter metadata based on the selected sampleId
        var resultArray = metadata.filter(meta => meta.id == sampleId);
        var result = resultArray[0];
        // Select the panel with id of `#sample-metadata`
        var metadataPanel = d3.select("#sample-metadata");

        // Clear any existing metadata
        metadataPanel.html("");

        // Display each key-value pair from the metadata JSON object
        Object.entries(result).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}
// The 'optionChanged' function is called via the <select id="selDataset" onchange="optionChanged(this.value)"></select> line in the HTML code
// It triggers at the 'onchange' event of the dropdown menu selection modification, then rebuilds the charts and such with the new selection

function optionChanged(newSampleId) {
    // Update charts and metadata based on the selected sample ID
    buildCharts(newSampleId);
    buildMetadata(newSampleId);
}



initialize();