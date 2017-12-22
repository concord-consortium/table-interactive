import React, {PureComponent} from 'react';
import ReactHandsontable from './react-handsontable';

const ROW_LINE_HEIGHT = 22;
const AVG_LABEL = "Average";

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
      onDataChange(this.removeAvgRow(this.userData));
    }
  }

  get handsontableOptions() {
    const { columns, headingWidths, rowLines, averages, onDataChange } = this.props;
    let tableData = this.data;
    let showAvgs = columns.find((column)=>{return column.average === true}) !== undefined;
    if(showAvgs) {
      let avgRow = averages.concat();
      // hide averages for columns not set to display it
      columns.forEach((column, colIdx) => {
        if(!column.average) {
          avgRow[colIdx] = "";
        }
      });
      avgRow[0] = AVG_LABEL;
      if(tableData[tableData.length-1][0] !== AVG_LABEL) {
        tableData.push(avgRow);
      }
      else {
        tableData[tableData.length-1] = avgRow;
      }
    }
    const opts = {
      data: tableData,
      cells: (row, col) => {
        // Make the average row read-only
        let cellProps = {};
        let column = columns[col];
        cellProps.readOnly = column.readOnly || showAvgs && row === this.data.length;
        return cellProps;
      },
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
          onDataChange(this.removeAvgRow(this.userData));
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

  removeAvgRow(data) {
    let lastIdx = data.length - 1;
    if(data[lastIdx] && data[lastIdx][0] === AVG_LABEL) {
      data.splice(lastIdx, 1);
    }
    return data;
  }

  get data() {
    const { labels, columns } = this.props;
    const data = [];
    labels.forEach((label, rowIdx) => {
      const row = [label];
      for (let i = 1; i < columns.length; i++) {
      let userData = this.getUserData(rowIdx, i);
        row.push(userData);
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
  initialData: null,
  labels: ['a', 'b', 'c', 'd'],
  columns: [{heading: 'col1'}, {heading: 'col2'}],
  rowLines: 1,
  headingsWidths: undefined,
  onDataChange: function (data) {}
};
