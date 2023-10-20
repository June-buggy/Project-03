d3.json("static/pclass_JSON.json").then((data) => {
    //  Create the Traces
    let trace1 = {
      x: data.pclassind,
      y: data.pclassvc,
      type: "bar",
    };

    let layout = {
        title: "Titanic Passengers by Ticket Class"
      };
      
    // Create the data array for the plot.
    let plotData = [trace1];

    // Plot the chart to a div tag with an ID of "plot".
    Plotly.newPlot("simpleplot", plotData, layout);
  });
  
