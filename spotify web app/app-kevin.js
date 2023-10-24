//set up url
const url = "https://raw.githubusercontent.com/June-buggy/Project-03/main/Resources/dataset.json"


// //fetch data
// d3.json(url).then(function(data){
//     console.log(data);
// });


function initialize() {
    d3.json(url).then(data => {

        // selecting dropdown menu to populate it with the full list of genres
        let dropdownMenu = d3.select("#selDataset");
        
        // creating an array to hold genre of every song
        let genres = []
        data.forEach((song) => {
            // getting all genres
            genres.push(song.track_genre)
        });
        
        // reducing genres to only unique genres with no repeats
        let unique_genres = [... new Set(genres)]


        // adding unique genres to a dropdown
        unique_genres.forEach(genre => {
            dropdownMenu.append("option").text(genre).property("value", genre);
        })


        // selecting dropdown for song features
        let dropdownFeatures = d3.select('#selFeature');

        // array of different song features of interest
        let features = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence']

        // adding features to dropdown
        features.forEach(feature => {
            dropdownFeatures.append('option').text(feature).property("value", feature);
        })

        // creating charts with default genre as acoustic, default feature as danceabilitya
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

    // creating string to list capitalized genre in chart title
    let capitalGenre = genre.charAt(0).toUpperCase() + genre.slice(1)

    // creating vega lite object
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
          "size": 40
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

function barChart(data, genre){
    // BAR CHART

    // filtering json dataset for the selected genre
    let filteredData = data.filter((row) => {
        return row.track_genre == genre
    })
    
    // holding track names and popularity of each track
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
        hovertemplate:  '<br><b>Popularity</b>: %{x}<br>' +
                        '<b>Song</b>: %{text}<extra></extra>',
        //sorting bars
        transforms:[{
            type: 'sort',
            target: 'x',
            order: 'ascending'
        }],
        //changing graph to horizontal
        orientation: 'h'
    };


    // creating string to list capitalized genre in chart title
    let capitalGenre = genre.charAt(0).toUpperCase() + genre.slice(1)
    // Apply the group barmode to the layout
    let layout = {
        title: "Top Songs for the " + capitalGenre + " Genre"
    };

    // taking only top ten songs based on popularity
    barTrace.x = barTrace.x.slice(0, 10)
    barTrace.y = barTrace.y.slice(0, 10)

    let barData = [barTrace]

    Plotly.newPlot("bar", barData, layout);
}


function bubbleChart(data, feature){
    // BUBBLE CHART

    //let features = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence']
    
    // holding song scores (based on feature) and song genres
    let scores = []
    let genres = []

    data.forEach((song) => {
        // getting all genres of each song
        genres.push(song.track_genre)
    });
    
    // creating array of unique genres for dropdown
    let unique_genres = [... new Set(genres)]

    // calculating average score for each genre for the selected feature
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

    // calculating a bubble size for the score of each genre
    let score_sizes = scores.map(score => score * 30)

    
    // creating bubble chart
    let trace = {
        x: unique_genres,
        y: scores,
        mode: 'markers',
        hovertemplate:  '<br><b>Genre</b>: %{x}<br>' +
                        '<b>Score:</b>: %{y}<extra></extra>',
        marker: {
            size: score_sizes,
            color: [...Array(unique_genres.length).keys()],
            colorscale: 'Greens',
            line: {
                color: 'black',
                width: 1
            }
        },
        text: scores
    }
    // creating string to list capitalized feature in chart title
    let capitalScore = feature.charAt(0).toUpperCase() + feature.slice(1)

    let layout = {
        title: capitalScore + " Scores for Each Genre"
    };

    let bubbleData = [trace]
    Plotly.newPlot("bubble", bubbleData, layout)
}


// updates genre chart when selected genre is changed
function updatePlotlyGenre(genre){
    d3.json(url).then(function(data){
        createFeaturesChart(data, genre)
        barChart(data, genre)
    });
}
// updates features chart when selected feature is changed
function updatePlotlyFeature(feature){
    d3.json(url).then(function(data){
        bubbleChart(data, feature)
    });
}
initialize();