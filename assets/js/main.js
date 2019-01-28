
var ctx = document.getElementById('chart').getContext('2d');
var x_axis, y_axis;
var current_category_selections = {
  "Architecture and engineering occupations": true,
  "Arts, design, entertainment, sports, and media occupations": true,
  "Business and financial operations occupations": true,
  "Community and social service occupations": true,
  "Computer and mathematical occupations": true,
  "Education, training, and library occupations": true,
  "Healthcare practitioners and technical occupations": true,
  "Legal occupations": true,
  "Life, physical, and social science occupations": true,
  "Management occupations": true,
  "Construction and extraction occupation": true,
  "Farming, fishing, and forestry occupations": true,
  "Installation, maintenance, and repair occupations": true,
  "Production occupations": true,
  "Transportation and material moving occupations": true,
  "Office and administrative support occupations": true,
  "Sales and related occupations": true,
  "Building and grounds cleaning and maintenance occupations": true,
  "Food preparation and serving related occupations": true,
  "Personal care and service occupations": true,
  "Protective service occupations": true,
  "Healthcare support occupations": true,
};


var current_datasets = [];

var properLabels = {
  "num_employed": "Number Employed",
  "women": "Percentage of Women",
  "men": "Percentage of Men",
  "white": "Percentage of White Americans",
  "black": "Percentage of African Americans",
  "asian": "Percentage of Asian Americans",
  "latino": "Percentage of Hispanic/Latino descent",
  "total_weekly": "Average weekly earnings",
  "men_weekly": "Average weekly earnings for men",
  "women_weekly": "Average weekly earnings for women",
  "median_age": "Median age"
}

function showAllCategories() {
  // set all categories true
  Object.keys(current_category_selections).forEach(function(key) {
    current_category_selections[key] = true;
  });

  regenerateAndUpdate()
}

function clickCategory(category) {
  var allTrue = true;

  Object.keys(current_category_selections).forEach(function(key) {
    if (current_category_selections[key] == false) {
      allTrue = false;
    }
  });

  if (allTrue) {
    Object.keys(current_category_selections).forEach(function(key) {
      current_category_selections[key] = false;
    });
  }

  current_category_selections[category] = !current_category_selections[category];

  regenerateAndUpdate()
}

function regenerateAndUpdate() {
  generateRealDatasets();
  updateChart(scatterChart);
}


function getXaxisValue() {
  x_axis = document.getElementById("xaxis").value;
  // console.log('get x axis called')
}

function getYaxisValue() {
  y_axis = document.getElementById("yaxis").value;
  // console.log('get y axis called')
}

function changeAxis() {
  getXaxisValue();
  getYaxisValue();
  generateRealDatasets();
  updateChart(scatterChart);
}

function updateChart(chart) {
  $('#chart').remove();
  $('.right-col').append('<canvas id="chart" width="600" height="400"><canvas>');
  ctx = document.getElementById('chart').getContext('2d');
  scatterChart = new Chart(ctx, chartOptions());
}

function createDataset(x_axis,y_axis,dataset) {
  temp_dataset = [];
  dataset.forEach(function(currentValue, i) {
    temp_dataset.push({
      x: currentValue[x_axis],
      y: currentValue[y_axis],
      r: currentValue.num_employed/200
    })
  });
  return temp_dataset;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateRealDatasets() {
  current_datasets = []
  // go through datasets.js and return a real dataset
  datasets.forEach(function(currentValue, i) {
    if (current_category_selections[currentValue.label]) {
      current_datasets.push({
        fill: currentValue.fill,
        backgroundColor: currentValue.backgroundColor,
        data: createDataset(x_axis,y_axis,currentValue.data),
      })
    }
  });
  // console.log('generate real datasets called')
}

function resetZoom() {
  scatterChart.resetZoom()
}

function chartOptions() {
  return {
        type: 'bubble',
        data: {
            datasets: current_datasets
        },
        options: {
            title: {
              display: true,
            },
            legend: {
              display: false
            },
            tooltips: {
              displayColors: false,
              titleFontFamily: "Lato",
              titleFontStyle: "Bold",
              titleFontSize: 18,
              bodyFontFamily: "Lato",
              bodyFontSize: 13,
              callbacks: {
                title: function(tooltipItem, data) {
                  // tooltipitem {0: []}
                  // Return value for title
                  var item = datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index]
                  return item.job || '';
                },
                label: function(tooltipItem, data) {
                  var item = datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                  var label = [];
                  label.push("Number employed: " + numberWithCommas(item.num_employed*1000));

                  label.push("Women: " + item.women + "%");
                  label.push("Men: " + item.men + "%");
                  label.push(""); // new line

                  label.push("White: " + item.white + "%");
                  label.push("Black: " + item.black + "%");
                  label.push("Asian: " + item.asian + "%");
                  label.push("Hispanic/Latino: " + item.latino + "%");
                  label.push(""); // new line

                  label.push("Average Salary: $" + numberWithCommas(item.total_weekly) + "/week");
                  label.push("Average Male Salary: $" + numberWithCommas(item.men_weekly) + "/week");
                  label.push("Average Female Salary: $" + numberWithCommas(item.women_weekly) + "/week");
                  label.push(""); // new line
                  
                  label.push("Median Age: " + item.median_age + " years");
                  return label;
                },
              }
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    scaleLabel: {
                      display: true,
                      labelString: properLabels[x_axis],
                      fontFamily: "Lato",
                      fontSize: 16,
                    },
                    ticks: {
                      fontFamily: "Lato",
                      fontStyle: "Bold"
                    }
                    // position: 'bottom'
                }],
                yAxes: [{
                    type: 'linear',
                    scaleLabel: {
                      display: true,
                      labelString: properLabels[y_axis],
                      fontFamily: "Lato",
                      fontSize: 16,
                    },
                    ticks: {
                      fontFamily: "Lato",
                      fontStyle: "Bold"
                    }
                    // position: 'bottom'
                }]
            },
            pan: {
          		enabled: true,
          		mode: 'xy',
          		speed: 20,
          		threshold: 10
          	},

            // Container for zoom options
            zoom: {
              // drag: true,
                speed: 0.01,
                enabled: true,
                mode: 'xy',
                  limits: {
      							max: 10,
      							min: 0.5
      						}
            }
        }
    }
}

getXaxisValue();
getYaxisValue();
generateRealDatasets();

var scatterChart;

scatterChart = new Chart(ctx, chartOptions());
