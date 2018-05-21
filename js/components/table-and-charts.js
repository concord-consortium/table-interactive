import React, {PureComponent} from 'react';
import Table from './table';
import Chart from './chart';

import '../../css/table-and-charts.less'

export default class TableAndCharts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.initialData
    };
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(data) {
    const { onDataChange } = this.props;
    this.setState({data});
    onDataChange(data);
  }

  componentWillReceiveProps() {
    const { data } = this.state
    // Column properties might have been updated, so calculate averages.
    this.setState({ averages: this.calcAverages(data) });
  }

  
  calcAverages(data) {
    const { columns } = this.props;
    const colsData = columns.map((column, colIdx) => {
      if (!column.average) return null;
      return data !== null ? data.map(row => row[colIdx]) : [];
    });
    return colsData.map(column => {
      if (column === null) {
        return ''
      }
      let sum = 0, valCount = 0;
      column.forEach(value => {
        value = parseFloat(value);
        if (!isNaN(value)) {
          sum += value;
          valCount++;
        }
      });
      return valCount > 0 ? sum / valCount : '';
    });
  }

  renderCharts(averages) {
    const { columns, labels, chartWidth, chartHeight, chartAvgs } = this.props;
    const { data } = this.state;
    return columns.map((column, colIdx) => {
      if (!column.chart) return null;
      const colData = data !== null ? data.map(row => row[colIdx]) : [];
      const chartLabels = labels.concat();
      if (chartAvgs && column.average) {
        chartLabels.push('Average')
        colData.push(averages[colIdx])
      }
      return (
        <Chart key={colIdx} data={colData} color={column.chartColor} labels={chartLabels} xLabel={columns[0].heading} name={column.heading} width={chartWidth} height={chartHeight}/>
      )
    });
  }

  render() {
    const { columns, labels, rowLines, initialData } = this.props;
    const { data } = this.state;
    const averages = this.calcAverages(data)
    return (
      <div className="table-and-charts">
        <Table columns={columns} labels={labels} rowLines={rowLines} initialData={initialData} averages={averages} onDataChange={this.handleDataChange}/>
        { this.renderCharts(averages) }
      </div>
    );
  }
}

TableAndCharts.defaultProps = {
  initialData: null,
  onDataChange: function (data) {}
};
