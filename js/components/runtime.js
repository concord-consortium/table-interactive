import React, {PureComponent} from 'react';
import setupBarChart from '../setup-bar-chart';
import setupTable from '../setup-table';

export default class Runtime extends PureComponent {
  componentDidMount() {
    var headings = [ 'Location', 'Description of Location', 'Temperature', 'Humidity', 'Light'];
    var labels = [
      'A',
      'B',
      'C',
      'D',
      'E'
    ];

    var data = [];

    var charts = [
      setupBarChart({
        data: data,
        headings: headings,
        labels: labels,
        columnIndices: [2],
        dataSetColors: [ "rgb(207, 67, 0)"],
        numRows: labels.length,
        chartElement: this.refs.myChart1
      }),
      setupBarChart({
        data: data,
        headings: headings,
        labels: labels,
        columnIndices: [3],
        dataSetColors: [ "rgb(207, 67, 0)"],
        numRows: labels.length,
        chartElement: this.refs.myChart2
      }),
      setupBarChart({
        data: data,
        headings: headings,
        labels: labels,
        columnIndices: [4],
        dataSetColors: [ "rgb(207, 67, 0)"],
        numRows: labels.length,
        chartElement: this.refs.myChart3
      })
    ];

    var table = setupTable({
      element: this.refs.table,
      data: data,
      headings: headings,
      headingWidths: [100, 400, 130, 130, 130],
      labels: labels,
      charts: charts
    });
  }
  render() {
    return (
      <div>
        <div ref="table"></div>
        <canvas ref="myChart1" width="240" height="300"/>
        <canvas ref="myChart2" width="240" height="300"/>
        <canvas ref="myChart3" width="240" height="300"/>
      </div>
    );
  }
}
