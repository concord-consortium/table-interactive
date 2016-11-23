import React, {PureComponent} from 'react';
import {Bar} from 'react-chartjs-2';

const DEF_COLOR = '#ff6384';

export default class Chart extends PureComponent {
  get chartData() {
    const { name, labels, data, color } = this.props;
    return {
      labels,
      datasets: [{
        label: name,
        backgroundColor: color || DEF_COLOR,
        data
      }]
    };
  }

  get options() {
    const { xLabel, name } = this.props;
    return {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: name
          },
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: xLabel
          }
        }]
      },
      animation: false
    };
  }

  render() {
    let { width, height } = this.props;
    width = parseInt(width);
    height = parseInt(height);
    // Little hack - react-chart-2 doesn't work well when you dynamically change width or height properties.
    // So, if we provide `key` based on width and height, it will force React to completely recreate this element.
    const barGraphKey = `${width}${height}`;
    return (
      <div className="chart" style={{width: `${width}px`, height: `${height}px`}}>
        <Bar key={barGraphKey} width={width} height={height} data={this.chartData} options={this.options}/>
      </div>
    );
  }
}

Chart.defaultProps = {
  width: 300,
  height: 240,
  name: 'Test data',
  xLabel: 'X label',
  color: DEF_COLOR,
  labels: [1, 2, 3],
  data: [0, 1, 2]
};
