import React, {PureComponent} from 'react';
import ReactHandsontable from './react-handsontable';

const ROW_LINE_HEIGHT = 22;

export default class Table extends PureComponent {
  constructor(props) {
    super(props);
    this.userData = this.props.initialData;
    this.state = {
      avgRow: ["Average"]
    };
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
    const { avgRow } = this.state;
    let tableData = this.data;
    let showAvgs = columns.find((column)=>{return column.average === true}) !== undefined;
    if(showAvgs && tableData[tableData.length-1][0] !== "Average") {
      let avgDisplay = avgRow.concat();
      for(let i=1; i < columns.length; i++) {
        if(!columns[i].average) {
          avgDisplay[i] = "";
        }
      }
      tableData.push(avgDisplay);
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
          onDataChange(this.userData);
          this.setState({avgRow: this.calcAverages(this.data)});
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
      let userData = this.getUserData(rowIdx, i);
        row.push(userData);
      }
      data.push(row);
    });

    return data;
  }
  
  calcAverages(data) {
    const { columns } = this.props;
    let avgRow = ["Average"];
    for(let i=1; i < columns.length; i++) {
      let c = columns[i];     
      let sum = 0;
      for(let k=0; k < data.length; k++) {
        let value = data[k][i];
        if(value != undefined && value != "") {
          sum += parseFloat(value);
        }
      }
      avgRow[i] = sum / columns.length;
    }
  
    return avgRow;
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
