import React, {PureComponent} from 'react';
import Table from './table';
import Chart from './chart';

import '../../css/table-and-charts.less'

export default class TableAndCharts extends PureComponent {

  renderCharts() {
    const { columns, labels, chartWidth, chartHeight } = this.props;
    return columns.map((column, colIdx) => {
      if (!column.graph) return null;
      return (
        <Chart key={colIdx} labels={labels} name={column.heading} width={chartWidth} height={chartHeight}/>
      )
    });
  }

  render() {
    const { columns, labels } = this.props;
    return (
      <div className="table-and-charts">
        <Table columns={columns} labels={labels}/>
        {this.renderCharts()}
      </div>
    );
  }
}
