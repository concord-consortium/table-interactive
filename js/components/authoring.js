import React, {PureComponent} from 'react';
import Table from './table';

import '../../css/authoring.less';

export default class Authoring extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          heading: 'Labels',
          readOnly: true,
          graph: false
        },
        {
          heading: 'Description',
          readOnly: false,
          graph: false
        },
        {
          heading: 'Graphable value',
          readOnly: false,
          graph: true
        }
      ],
      labels: ['a', 'b', 'c']
    };
    this.handleListElemChange = this.handleListElemChange.bind(this);
    this.handleListElemRemove = this.handleListElemRemove.bind(this);
    this.handleListElemAdd = this.handleListElemAdd.bind(this);
    this.handleColumnAdd = this.handleColumnAdd.bind(this);
  }

  handleListElemChange(event) {
    const listName = event.target.dataset.listName;
    const propName = event.target.dataset.propName;
    const index = event.target.dataset.index;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const list = this.state[listName];
    if (propName) {
      list[index][propName] = value;
    } else {
      list[index] = value;
    }
    this.setState({[listName]: list.concat()}); // .concat() to duplicate array.
  }

  handleListElemRemove(event) {
    const listName = event.target.dataset.listName;
    const list = this.state[listName];
    list.splice(Number(event.target.dataset.index), 1);
    this.setState({[listName]: list.concat()}); // .concat() to duplicate array.
  }

  handleListElemAdd(event) {
    const listName = event.target.dataset.listName;
    const newValue = event.target.dataset.newValue;
    const list = this.state[listName];
    this.setState({[listName]: list.concat(newValue)});
  }

  handleColumnAdd(event) {
    const { columns } = this.state;
    const newCol = {
      heading: "new column",
      readOnly: false,
      graph: false
    };
    this.setState({columns: columns.concat(newCol)});
  }

  renderListElements(listName) {
    const list = this.state[listName];
    return list.map((listElement, index) => {
      return (
        <div key={index}>
          <input type="text" value={listElement} data-index={index} data-list-name={listName} onChange={this.handleListElemChange}/>
          <i className="rm-icon fa fa-times-circle" data-index={index} data-list-name={listName} onClick={this.handleListElemRemove}/>
        </div>
      )
    });
  }

  renderListEditor(title, listName) {
    return (
      <div className="list-editor">
        {title}
        {this.renderListElements(listName)}
        <div>
          <i className="add-icon fa fa-plus-circle" data-list-name={listName} data-new-value="new value" onClick={this.handleListElemAdd}/>
        </div>
      </div>
    );
  }

  renderColumns() {
    const { columns } = this.state;
    return columns.map((col, index) => {
      return (
        <tr key={index}>
          <td><input type="text" value={col.heading} data-index={index} data-list-name="columns" data-prop-name="heading" onChange={this.handleListElemChange}/></td>
          <td><input type="checkbox" checked={col.readOnly} data-index={index} data-list-name="columns" data-prop-name="readOnly" onChange={this.handleListElemChange}/></td>
          <td><input type="checkbox" checked={col.graph} data-index={index} data-list-name="columns" data-prop-name="graph" onChange={this.handleListElemChange}/></td>
          <td><i className="rm-icon fa fa-times-circle" data-index={index} data-list-name="columns" onClick={this.handleListElemRemove}/></td>
        </tr>
      )
    });
  }

  renderColumnsEditor() {
    return (
      <div className="list-editor">
        <table>
          <tbody>
            <tr><th>Column heading</th><th>Read only</th><th>Graph</th><th></th></tr>
            {this.renderColumns()}
          </tbody>
        </table>

        <div>
          <i className="add-icon fa fa-plus-circle" onClick={this.handleColumnAdd}/>
        </div>
      </div>
    );
  }

  render() {
    const { columns, labels } = this.state;
    return (
      <div className="authoring">
        <h2>Table authoring</h2>
        {this.renderColumnsEditor()}
        {this.renderListEditor('Labels', 'labels')}
        <div className="preview">
          Preview:
          <Table columns={columns} labels={labels}/>
        </div>
      </div>
    );
  }
}
