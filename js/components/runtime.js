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
    const { authoredState, initialInteractiveState } = this.props;
    const { columns, labels, chartWidth, chartHeight } = authoredState;
    const { data } = initialInteractiveState;
    return (
      <TableAndCharts columns={columns} labels={labels} chartWidth={chartWidth} chartHeight={chartHeight}
                      initialData={data}
                      onDataChange={this.handleDataChange}/>
    )
  }
}

Runtime.defaultProps = {
  onInteractiveStateChange: function (state) {}
};
