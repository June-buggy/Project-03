//set up url
const url = "https://raw.githubusercontent.com/June-buggy/Project-03/main/Resources/dataset.json"

//set up data promise 
const dataPromise = d3.json(url);
    console.log("Data Promise: ", dataPromise);

//fetch data
d3.json(url).then(function(data){
    console.log(data);
});


function init() {
  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");
  // Fetch the JSON data and console log it
  d3.json(url).then((data) => {
      console.log(`Data: ${data}`);
      // An array of id names
      let names = data.names;
      names.forEach((name) => {
          // Append each name as an option to the drop down menu.
          dropdownMenu.append("option").text(name).property("value", name);
      });
       // Use the first sample from the list to build the initial plots
      let name = names[0];

 // Call the functions to make the demographic panel, bar chart, and bubble chart
   //demo(name);
   //bar(name);
   //bubble(name);
   //gauge(name);
   });
  }
// Get a new data each time when a new sample is selected
//function optionChanged(selectedValue) {
   //demo(selectedValue);
   //bar(selectedValue);
   //bubble(selectedValue);
   //gauge(selectedValue)


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