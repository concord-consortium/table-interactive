import React, {PureComponent} from 'react';
import Table from './table';
import Chart from './chart';

import '../../css/table-and-charts.less'

export default class TableAndCharts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.initialData,
      averages: []
    };
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(data) {
    const { onDataChange } = this.props;
    let averages = this.calcAverages(data);
    this.setState({data, averages});
    onDataChange(data);
  }

  
  calcAverages(data) {
    const { columns } = this.props;
    const colsData = columns.map((column, colIdx) => {
      if (!column.chart) return null;
      return data !== null ? data.map(row => row[colIdx]) : [];
    });
    const avgs = colsData.map((column, colIdx) => {
      if(column === null) {
        return "";
      }
      let sum = 0, valCount = 0;
      column.forEach((value, rowIdx) => {
        if(value != undefined && value != "") {
          sum += parseFloat(value);
          valCount++;
        }
      });
      return sum / valCount;
    });
    return avgs;
  }

  renderCharts() {
    const { columns, labels, chartWidth, chartHeight, chartAvgs } = this.props;
    const { data, averages } = this.state;
    return columns.map((column, colIdx) => {
      if (!column.chart) return null;
      const colData = data !== null ? data.map(row => row[colIdx]) : [];
      const chartLabels = labels.concat();
      if(chartAvgs && column.average) {
        chartLabels.push("Average");
        colData.push(averages[colIdx]);
      }
      return (
        <Chart key={colIdx} data={colData} color={column.chartColor} labels={chartLabels} xLabel={columns[0].heading} name={column.heading} width={chartWidth} height={chartHeight}/>
      )
    });
  }

  render() {
    const { columns, labels, rowLines, initialData } = this.props;
    const { averages } = this.state;
    return (
      <div className="table-and-charts">
        <Table columns={columns} labels={labels} rowLines={rowLines} initialData={initialData} averages={averages} onDataChange={this.handleDataChange}/>
        {this.renderCharts()}
      </div>
    );
  }
}

TableAndCharts.defaultProps = {
  initialData: null,
  onDataChange: function (data) {}
};
