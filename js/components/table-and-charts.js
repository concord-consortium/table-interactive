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

  renderCharts() {
    const { columns, labels, chartWidth, chartHeight } = this.props;
    const { data } = this.state;
    return columns.map((column, colIdx) => {
      if (!column.chart) return null;
      const colData = data !== null ? data.map(row => row[colIdx]) : [];
      return (
        <Chart key={colIdx} data={colData} color={column.chartColor} labels={labels} name={column.heading} width={chartWidth} height={chartHeight}/>
      )
    });
  }

  render() {
    const { columns, labels, initialData } = this.props;
    return (
      <div className="table-and-charts">
        <Table columns={columns} labels={labels} initialData={initialData} onDataChange={this.handleDataChange}/>
        {this.renderCharts()}
      </div>
    );
  }
}

TableAndCharts.defaultProps = {
  initialData: null,
  onDataChange: function (data) {}
};
