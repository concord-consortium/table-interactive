import Chart from 'chart.js';

Chart.defaults.global.animation = false;

function initializeChartDataset(label, color, numValues) {
  var data = [];
  for (var i = 0; i < numValues; i++) {
    data.push(null);
  }

  return {
    label: label,
    fillColor: color,
    strokeColor: color,
    highlightFill: color,
    highlightStroke: color,
    data: data
  };
}

function setupDatasetConfigs(options) {
  var datasetConfigs = [];
  var config;

  options.columnIndices.forEach(function (colIndex, datasetIndex) {
    config = initializeChartDataset(options.headings[colIndex], options.dataSetColors[datasetIndex], options.numRows);
    datasetConfigs.push(config);
  });
  return datasetConfigs;
}

/**
 data
 columnIndices - [1,2,3]
 headings
 dataSetColors
 numRows - labels.length
 chartElement - document.getElementById("myChart")
 legendElement - document.getElementById("legend")
 */
export default function setupBarChart(options) {
  var chartData1 = {
    labels: options.labels,
    datasets: setupDatasetConfigs(options)
  };

  var ctx = options.chartElement.getContext("2d");
  var myNewChart = new Chart(ctx).Bar(chartData1);

  if (options.legendElement != null) {
    options.legendElement.innerHTML = myNewChart.generateLegend();
  }

  function convertValue(value) {
    if (value == null) {
      return value;
    }
    var result = parseFloat(value);
    if (isNaN(result)) {
      return null;
    }
    return result;
  }

  if (myNewChart == null) {
    return null;
  }

  myNewChart.updateFromData = function () {
    // update the data sections of the chartData.datasets
    // recreate the chart
    options.data.forEach(function (row, index) {
      options.columnIndices.forEach(function (colIndex, datasetIndex) {
        myNewChart.datasets[datasetIndex].bars[index].value = convertValue(row[colIndex]);
      });
    });

    myNewChart.update();
  };

  return myNewChart;
}
