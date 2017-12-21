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
    const { columns, labels, chartWidth, chartHeight, chartAvgs } = this.props;
    const { data } = this.state;
    return columns.map((column, colIdx) => {
      if (!column.chart) return null;
      const colData = data !== null ? data.map(row => row[colIdx]) : [];
      const chartLabels = labels.concat();
      if(chartAvgs && column.average) {
        chartLabels.push("Average");
        //for(let i=0; i < colData.length; colData++)
        let sum = 0;
        for(let i=0; i < data.length; i++) {
          let value = colData[i];
          if(value != undefined && value != "") {
            sum += parseFloat(value);
          }
        }
        colData.push(sum / colData.length);
        //colData.push(colData.reduce((a,b) => (parseFloat(a != "" ? a : 0) + parseFloat(b != "" ? b : 0))) / colData.length);
      }
      return (
        <Chart key={colIdx} data={colData} color={column.chartColor} labels={chartLabels} xLabel={columns[0].heading} name={column.heading} width={chartWidth} height={chartHeight}/>
      )
    });
  }

  render() {
    const { columns, labels, rowLines, initialData } = this.props;
    return (
      <div className="table-and-charts">
        <Table columns={columns} labels={labels} rowLines={rowLines} initialData={initialData} onDataChange={this.handleDataChange}/>
        {this.renderCharts()}
      </div>
    );
  }
}

TableAndCharts.defaultProps = {
  initialData: null,
  onDataChange: function (data) {}
};
