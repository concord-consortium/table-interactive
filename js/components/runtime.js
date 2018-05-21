import React, {PureComponent} from 'react';
import TableAndCharts from './table-and-charts';

export default class Runtime extends PureComponent {
  constructor(props) {
    super(props);
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(data) {
    const { onInteractiveStateChange } = this.props;
    onInteractiveStateChange({data});
  }

  render() {
    const { authoredState, initialInteractiveState, readOnly } = this.props;
    const { columns, labels, chartWidth, chartHeight, rowLines, chartAvgs } = authoredState;
    const { data } = initialInteractiveState;
    // If `readOnly` property is set to true, overwrite `readOnly` property of the column definitions.
    const columnsDef = readOnly ? columns.map(c => Object.assign({}, c, {readOnly: true})) : columns;
    return (
      <TableAndCharts columns={columnsDef} labels={labels} rowLines={rowLines} 
                      chartWidth={chartWidth} chartHeight={chartHeight}
                      chartAvgs={chartAvgs}
                      initialData={data}
                      onDataChange={this.handleDataChange}/>
    )
  }
}

Runtime.defaultProps = {
  onInteractiveStateChange: function (state) {}
};
