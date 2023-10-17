document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the backend
    fetch('/fetch_data')
      .then(response => response.json())
      .then(data => {
        // Process the data as needed
  
        // Create Plotly charts
        createChart1(data);
        createChart2(data);
        // Add more functions to create additional charts as needed
      })
      .catch(error => console.error('Error fetching data:', error));
  });
  
  function createChart1(data) {
    // Create a Plotly chart (e.g., bar chart)
    const chartData = {
      x: [/* data for x-axis */],
      y: [/* data for y-axis */],
      type: 'bar'
    };
  
    const layout = {
      title: 'Chart 1',
      // Add more layout options as needed
    };
  
    Plotly.newPlot('chart1', [chartData], layout);
  }
  
  function createChart2(data) {
    // Create another Plotly chart (e.g., scatter plot)
    const chartData = {
      x: [/* data for x-axis */],
      y: [/* data for y-axis */],
      mode: 'markers'
    };
  
    const layout = {
      title: 'Chart 2',
      // Add more layout options as needed
    };
  
    Plotly.newPlot('chart2', [chartData], layout);
  }