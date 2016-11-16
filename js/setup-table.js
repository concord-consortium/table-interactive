import Handsontable from 'handsontable';
import 'handsontable.css';

function initializeTableData(data, labels, numValues) {
  labels.forEach(function (label) {
    var row = [label];
    for (var i = 0; i < numValues; i++) {
      row.push(null);
    }
    data.push(row);
  });
}

/**
 data
 labels
 headings
 headingWidths
 charts
 */
export default function setupTable(options) {
  initializeTableData(options.data, options.labels, options.headings.length - 1);

  var container = options.element;
  var columnConfigs = [{readOnly: true}];
  for (var i = 1; i < options.headings.length; i++) {
    columnConfigs.push({});
  }
  return new Handsontable(container, {
    data: options.data,
    contextMenu: true,
    colWidths: options.headingWidths,
    colHeaders: options.headings,
    columns: columnConfigs,
    rowHeaders: false,
    allowInsertRow: true,
    minSpareRows: 0,
    afterChange: function (change, type) {
      console.log(change, type);
      console.log(this.getData());
    }
  });
}
