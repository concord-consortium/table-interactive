import React, {PureComponent} from 'react';
import {Bar} from 'react-chartjs-2';

const aspectRatioOpt = {}//{maintainAspectRatio: false};

export default class Chart extends PureComponent {
  get graphData() {
    const { name, labels, data, color } = this.props;
    return {
      labels,
      datasets: [{
        label: name,
        backgroundColor: color,
        data
      }]
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
        <Bar key={barGraphKey} width={width} height={height} data={this.graphData} options={aspectRatioOpt}/>
      </div>
    );
  }
}

Chart.defaultProps = {
  width: 300,
  height: 240,
  name: 'Test data',
  color: 'rgb(255,99,132)',
  labels: [1, 2, 3],
  data: [0, 1, 2]
};
