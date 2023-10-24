//set up url
// Sophie and Alesya
//const url = "https://raw.githubusercontent.com/June-buggy/Project-03/main/Resources/dataset.json"
const url ='../static/all_Json.json'

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

        let dropdownFeatures = d3.select('#selFeature');

        let features = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence']
        features.forEach(feature => {
            dropdownFeatures.append('option').text(feature).property("value", feature);
        })

        console.log()
        
       // creating features chart with default genre as acoustic
        createFeaturesChart(data, 'acoustic')
        barChart(data, 'acoustic')
        bubbleChart(data, 'danceability')
   });
}

function createFeaturesChart(data, genre){
    
    // filtering json dataset for the selected genre
    let filteredData = data.filter((row) => {
        return row.track_genre == genre
    })
    

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

    let capitalGenre = genre.charAt(0).toUpperCase() + genre.slice(1)

    // creating Vega lite object
    let vegaObject = {
        "title": "Feature Score Distribution for " + capitalGenre + " Songs",
        "width": 600,
        "height": 400,
        
        "data": {
            "values": dataObject
        },
        "mark": {
          "type": "boxplot",
          "extent": "min-max",
          "size": 40,
          "color": "green"
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
    
    // Embedding vega lite visualization in html file (id = vis)
    vegaEmbed('#vis', vegaObject);

}

    function barChart(data, genre){
   
        // Creating BAR CHART

    // filtering json dataset for the selected genre
    let filteredData = data.filter((row) => {
        return row.track_genre == genre
    })
    

    let tracks = []
    let popularity = []

    filteredData.forEach((row) => {
        tracks.push(row.track_name)
        popularity.push(row.popularity)
    })

    // creating data traces for bar chart
    let barTrace = {
        y: tracks,
        x: popularity,
        text: tracks,
        type: "bar",
        marker: {
            color: "green"
        },

        //sorting bars
        transforms:[{
            type: 'sort',
            target: 'x',
            order: 'ascending',
            
        }],
        //changing graph to horizontal
        orientation: 'h'
    };

    let capitalGenre = genre.charAt(0).toUpperCase() + genre.slice(1)
    // Apply the group barmode to the layout
    let layout = {
        title: "Top Songs for the " + capitalGenre + " Genre",
        color: "green"
    };

    // taking only top ten otu ids
    barTrace.x = barTrace.x.slice(0, 10)
    barTrace.y = barTrace.y.slice(0, 10)

    let barData = [barTrace]

    Plotly.newPlot("bar", barData, layout);
}



function bubbleChart(data, feature){
    
    // BUBBLE CHART
    let scores = []
    let genres = []

    data.forEach((song) => {
        // getting all genres
        genres.push(song.track_genre)
    });
    
    // creating array of unique genres for dropdown
    let unique_genres = [... new Set(genres)]

    for(let i = 0; i < unique_genres.length; i++){
        let filteredData = data.filter((row) => {
            return row.track_genre == unique_genres[i]
        })

        let sum = 0
        let count = 0
        filteredData.forEach((row) => {
            sum += parseFloat(row[feature])
            count += 1
            
        })
        let average = sum / count
        scores.push(average)
        //console.log(average)
    }

    let score_sizes = scores.map(score => score * 30)
    console.log(scores)
    console.log(score_sizes)
    
    //console.log(scores)
    //console.log(unique_genres)
    let trace = {
        x: unique_genres,
        y: scores,
        mode: 'markers',
        marker: {
            size: score_sizes,
            color: [...Array(unique_genres.length).keys()],
            colorscale: 'black',
            line: {
                color: 'black',
                width: 1
            }
        },
        text: scores
    }
    // Create the layout for the bubble chart.
    let layout = {
        title: "Avarage Scores per Genre ",
        xaxis: {title: "Genres"},
        margin: { t: 100 },
    };

    let bubbleData = [trace]
    Plotly.newPlot("bubble", bubbleData, layout)
}


// updates features chart when genre is changed
function updatePlotlyGenre(genre){
    d3.json(url).then(function(data){
        createFeaturesChart(data, genre)
        barChart(data, genre)
    });
}

function updatePlotlyFeature(feature){
    d3.json(url).then(function(data){
        bubbleChart(data, feature, lauout)
    });
}
initialize();
