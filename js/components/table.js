import React, {PureComponent} from 'react';
import ReactHandsontable from './react-handsontable';

const ROW_LINE_HEIGHT = 22;

export default class Table extends PureComponent {
  constructor(props) {
    super(props);
    this.userData = this.props.initialData;
  }

  componentWillUpdate(newProps) {
    const { columns, labels, onDataChange } = this.props;
    if (this.userData && (newProps.columns.length !== columns.length || newProps.labels.length !== labels.length)) {
      // Make sure that data corresponds to number of rows and columns.
      this.userData.length = newProps.labels.length;
      this.userData.forEach(row => {
        row.length = newProps.columns.length;
      });
      onDataChange(this.data);
    }
  }

  get handsontableOptions() {
    const { columns, headingWidths, rowLines, onDataChange } = this.props;
    const opts = {
      data: this.data,
      columns: columns,
      colWidths: headingWidths,
      colHeaders: columns.map(c => c.heading),
      contextMenu: false,
      rowHeaders: false,
      rowHeights: rowLines * ROW_LINE_HEIGHT,
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
    let showAvg = false;
    let avgRow = ["Average"];
    let sums = Array(labels.length).fill(0);
    labels.forEach((label, rowIdx) => {
      const row = [label];
      for (let i = 1; i < columns.length; i++) {
        var userData = this.getUserData(rowIdx, i);
        row.push(userData);
        
        if(columns[i].average == true) {
          showAvg = true;
        }
        sums[i] += userData ? parseFloat(userData) : 0;
      }
      data.push(row);
    });
    
    if(showAvg) {
      for (let i = 1; i < columns.length; i++) {
        avgRow[i] = columns[i].average ? sums[i] / labels.length : "";
      }
      data.push(avgRow);
    }
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
  initialData: null,
  labels: ['a', 'b', 'c', 'd'],
  columns: [{heading: 'col1'}, {heading: 'col2'}],
  rowLines: 1,
  headingsWidths: undefined,
  onDataChange: function (data) {}
};
