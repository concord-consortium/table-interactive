import React, {PureComponent} from 'react';
import ReactHandsontable from './react-handsontable';

export default class Table extends PureComponent {
  componentDidMount() {
    this.userData = [];
  }

  componentWillUpdate(newProps) {
    const { columns, labels, onDataChange } = this.props;
    if (newProps.columns.length !== columns.length || newProps.labels.length !== labels.length) {
      // Make sure that data corresponds to number of rows and columns.
      this.userData.length = newProps.labels.length;
      this.userData.forEach(row => {
        row.length = newProps.columns.length;
      });
      onDataChange(this.data);
    }
  }

  get handsontableOptions() {
    const { columns, headingWidths, onDataChange } = this.props;
    const opts = {
      data: this.data,
      columns: columns,
      colWidths: headingWidths,
      colHeaders: columns.map(c => c.heading),
      contextMenu: false,
      rowHeaders: false,
      allowInsertRow: false,
      minSpareRows: 0,
      afterChange: (change, type) => {
        if (type === 'edit') {
          this.userData = this.refs.hot.getData();
          onDataChange(this.userData);
        }
      }
    };
    return opts;
  }

  getUserData(row, col) {
    if (!this.userData) return null;
    if (this.userData[row] === undefined) return null;
    if (this.userData[row][col] === undefined) return null;
    return this.userData[row][col];
  }

  get data() {
    const { labels, columns } = this.props;
    const data = [];
    labels.forEach((label, rowIdx) => {
      const row = [label];
      for (let i = 1; i < columns.length; i++) {
        row.push(this.getUserData(rowIdx, i));
      }
      data.push(row);
    });
    return data;
  }

  render() {
    return (
      <div className="table">
        <ReactHandsontable ref="hot" {...this.handsontableOptions}/>
      </div>
    );
  }
}

Table.defaultProps = {
  data: [],
  labels: ['a', 'b', 'c', 'd'],
  columns: [{heading: 'col1'}, {heading: 'col2'}],
  headingsWidths: undefined,
  onDataChange: function (data) {}
};
