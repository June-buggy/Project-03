//set up url
const url = "https://raw.githubusercontent.com/June-buggy/Project-03/main/Resources/dataset.json"

//set up data promise 
//const dataPromise = d3.json(url);
//    console.log("Data Promise: ", dataPromise);

//fetch data
d3.json(url).then(function(data){
    console.log(data);
});


function initialize() {
    d3.json(url).then(data => {
        console.log("Dataset for viewing in log...", data);

        // Use D3 to select the dropdown menu
        //var names = data.track_name;

        let dropdownMenu = d3.select("#selDataset");
        
        let genres = []
        data.forEach((song) => {
            // getting all genres
            genres.push(song.track_genre)
        });
        
        // creating array of unique genres for dropdown
        let unique_genres = [... new Set(genres)]
        //console.log(unique_genres)

        // adding unique genres to a dropdown
        unique_genres.forEach(genre => {
            dropdownMenu.append("option").text(genre).property("value", genre);
        })

        console.log()
        // Use the first sample from the list to build the initial plots
        //let name = names[0];

        // Call the functions to make the demographic panel, bar chart, and bubble chart
        //demo(name);
        //bar(name);
        //bubble(name);
        //gauge(name);
        //createCharts(data)

        // creating features chart with default genre as acoustic
        createFeaturesChart(data, 'acoustic')
   });
}
// Get a new data each time when a new sample is selected
//function optionChanged(selectedValue) {
   //demo(selectedValue);
   //bar(selectedValue);
   //bubble(selectedValue);
   //gauge(selectedValue)

function createFeaturesChart(data, genre){
    
    // filtering json dataset for the selected genre
    let filteredData = data.filter((row) => {
        return row.track_genre == genre
    })
    console.log('createFeaturesChart')
    console.log(filteredData)

    // creating empty arrays to hold the individual feature scores for each song
    let danceability = []
    let energy = []
    let speechiness = []
    let acousticness = []
    let instrumentalness = []
    let liveness = []
    let valence = []
    
    // looping through filtered dataset to add feature score to each array
    filteredData.forEach((row) => {
        danceability.push(parseFloat(row.danceability))
        energy.push(parseFloat(row.energy))
        speechiness.push(parseFloat(row.speechiness))
        acousticness.push(parseFloat(row.acousticness))
        instrumentalness.push(parseFloat(row.instrumentalness))
        liveness.push(parseFloat(row.liveness))
        valence.push(parseFloat(row.valence))
    })

    // creating empty array to hold objects in the format: {Feature: 'feature type', Score: score}
    let dataObject = []

    // adding danceability scores
    danceability.forEach((val) =>{
        dataObject.push({Feature: 'danceability', Score: val})
    })
    // adding energy scores
    energy.forEach((val) =>{
        dataObject.push({Feature: 'energy', Score: val})
    })
    //adding speechiness scores
    speechiness.forEach((val) =>{
        dataObject.push({Feature: 'speechiness', Score: val})
    })
    // adding acousticness scores
    acousticness.forEach((val) =>{
        dataObject.push({Feature: 'acousticness', Score: val})
    })
    // adding instrumentalness scores
    instrumentalness.forEach((val) =>{
        dataObject.push({Feature: 'instrumentalness', Score: val})
    })
    // adding liveness scores
    liveness.forEach((val) =>{
        dataObject.push({Feature: 'liveness', Score: val})
    })
    // adding valence scores
    valence.forEach((val) =>{
        dataObject.push({Feature: 'valence', Score: val})
    })

    //console.log(dataObject)

    // creating vega lite object
    let vegaObject = {
        "data": {
            "values": dataObject
        },
        "mark": {
          "type": "boxplot",
          "extent": "min-max"
        },
        "encoding": {
          "y": {"field": "Feature", "type": "nominal"},
          "x": {
            "field": "Score",
            "type": "quantitative",
            "scale": {"zero": false}
          }
        }
    }
    
    // embedding vega lite visualization in html file (id = vis)
    vegaEmbed('#vis', vegaObject);
    


}


// updates features chart when genre is changed
function updatePlotly(genre){
    d3.json(url).then(function(data){
        createFeaturesChart(data, genre)
    });
}
initialize();