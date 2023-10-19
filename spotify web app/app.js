// Set up URL
const url = "https://raw.githubusercontent.com/June-buggy/Project-03/main/Resources/dataset.json";

// Set up data promise
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch data and create charts
dataPromise.then(function (data) {
  console.log(data);
  createCharts(data);
});

function optionChanged(selectedValue) {
  // Filter the data based on the selected track ID
  const filteredData = data.filter(item => item.track_id === selectedValue);
  // Call createCharts with the filtered data
  createCharts(filteredData);
}

function createCharts(data) {
   // Extracting popularity and genre data
   const popularityData = data.map(track => ({
    track_name: track.track_name,
    popularity: +track.popularity
  }));

  const genreData = data.reduce((acc, track) => {
    const genre = track.track_genre;
    acc[genre] = acc[genre] ? acc[genre] + 1 : 1;
    return acc;
  }, {});

  // Create a bar chart for popularity
  const popularityChartContainer = d3.select('#popularity-chart');
  const popularityChart = popularityChartContainer.append('svg')
    .attr('width', 400)
    .attr('height', 300);

  const xScale = d3.scaleBand()
    .domain(popularityData.map(d => d.track_name))
    .range([0, 400])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(popularityData, d => d.popularity)])
    .nice()
    .range([300, 0]);

  popularityChart.selectAll('.bar')
    .data(popularityData)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.track_name))
    .attr('y', d => yScale(d.popularity))
    .attr('width', xScale.bandwidth())
    .attr('height', d => 300 - yScale(d.popularity));

  popularityChart.append('g')
    .attr('transform', `translate(0, ${300})`)
    .call(d3.axisBottom(xScale).tickSize(0));

  popularityChart.append('g')
    .call(d3.axisLeft(yScale).ticks(5));

  // Create a pie chart for genre distribution
  const genreChartContainer = d3.select('#genre-chart');
  const pie = d3.pie().value(d => d.value);
  const genreDataArray = Object.entries(genreData).map(([key, value]) => ({ genre: key, value }));
  const color = d3.scaleOrdinal().domain(genreDataArray.map(d => d.genre)).range(d3.schemeCategory10);

  const radius = Math.min(400, 300) / 2;
  const genreChart = genreChartContainer.append('svg')
    .attr('width', 400)
    .attr('height', 300)
    .append('g')
    .attr('transform', `translate(${200},${150})`);

  const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
  const labelArc = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);

  const pieChart = genreChart.selectAll('.arc')
    .data(pie(genreDataArray))
    .enter().append('g')
    .attr('class', 'arc');

  pieChart.append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.genre));

  pieChart.append('text')
    .attr('transform', d => `translate(${labelArc.centroid(d)})`)
    .attr('dy', '0.35em')
    .text(d => `${d.data.genre} (${d.data.value})`);
}

function init() {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
  
    // Assuming names is a property of data and it's an object
    let names = data.names;
  
    // Check if names is an object
    if (names && typeof names === 'object') {
      // Iterate over the properties of the names object
      for (let name in names) {
        if (names.hasOwnProperty(name)) {
          // Append each name as an option to the dropdown menu.
          dropdownMenu.append("option").text(name).property("value", name);
        }
      }}}
  
      // Use the first property from the names object to build the initial plots
      let initialName = Object.keys(names)[0];
// Get new data each time a new sample is selected
function optionChanged(selectedValue) {
  demo(selectedValue);
  // Call other chart-related functions based on the selected value
  // bar(selectedValue);
  // bubble(selectedValue);
  // gauge(selectedValue)
}

function demo(selectedValue) {
  // Use D3 to select the dropdown menu
  d3.json(url).then((data) => {
    console.log(`Data: ${data}`);
     // get all of the metadata
    let metadata = data.metadata;
    // Filter based on the value of the sample
    let filteredData = metadata.filter((meta) => meta.id == selectedValue);
    //  Access index 0 from the array
    let obj = filteredData[0]
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");
    //  Use Object.entries() method in JS
    let entries = Object.entries(obj);
    // Use Object.entries to get the key/value pairs and put into the demographics box on the page
    entries.forEach(([key,value]) => {
        d3.select("#sample-metadata").append("h5").text(`${key.toUpperCase()}: ${value}`);
    });
    // Log the entries Array
    console.log(entries);
});
}

init();
