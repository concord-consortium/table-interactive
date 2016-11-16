import React, {PureComponent} from 'react';
import ReactHandsontable from './react-handsontable';

export default class Table extends PureComponent {
  get handsontableOptions() {
    const { columns, headingWidths } = this.props;
    const opts = {
      data: this.data,
      columns: columns,
      colWidths: headingWidths,
      colHeaders: columns.map(c => c.heading),
      contextMenu: false,
      rowHeaders: false,
      allowInsertRow: true,
      minSpareRows: 0,
      afterChange: function (change, type) {
      }
    };
    return opts;
  }

  get data() {
    const { labels, headings } = this.props;
    const data = [];
    labels.forEach(function (label) {
      const row = [label];
      for (let i = 0; i < headings.length - 1; i++) {
        row.push(null);
      }
      data.push(row);
    });
    return data;
  }

  render() {
    return (
      <ReactHandsontable {...this.handsontableOptions}/>
    );
  }
}

Table.defaultProps = {
  data: [],
  labels: ['a', 'b', 'c', 'd'],
  headings: ['column 1', 'column 2', 'column 3'],
  headingsWidths: undefined
};
