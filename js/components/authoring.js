import React, {PureComponent} from 'react';
import Runtime from './runtime';

import '../../css/authoring.less';

export default class Authoring extends PureComponent {
  constructor(props) {
    super(props);
    this.state = props.initialAuthoredState;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleListElemChange = this.handleListElemChange.bind(this);
    this.handleListElemRemove = this.handleListElemRemove.bind(this);
    this.handleListElemAdd = this.handleListElemAdd.bind(this);
    this.handleColumnAdd = this.handleColumnAdd.bind(this);
  }

  get authoredState() {
    // It's just the current state. In the future we might process it somehow, e.g. remove some state properties
    // that are related only to the authoring UI, not the final interactive.
    return this.state;
  }

  componentDidUpdate() {
    const { onAuthoredStateChange } = this.props;
    onAuthoredStateChange(this.authoredState);
  }

  handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({[name]: value});
  }

  handleListElemChange(event) {
    const listName = event.target.dataset.listName;
    const propName = event.target.dataset.propName;
    const index = event.target.dataset.index;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const list = this.state[listName].concat(); // .concat() to duplicate array.
    if (propName) {
      list[index][propName] = value;
    } else {
      list[index] = value;
    }
    this.setState({[listName]: list});
  }

  handleListElemRemove(event) {
    const listName = event.target.dataset.listName;
    const list = this.state[listName].concat(); // .concat() to duplicate array.
    list.splice(Number(event.target.dataset.index), 1);
    this.setState({[listName]: list});
  }

  handleListElemAdd(event) {
    const listName = event.target.dataset.listName;
    const newValue = event.target.dataset.newValue;
    const list = this.state[listName];
    this.setState({[listName]: list.concat(newValue)});
  }

  handleColumnAdd() {
    const { columns } = this.state;
    const newCol = {
      heading: "New column",
      readOnly: false,
      chart: false
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
      <div className="edit-section">
        {title}
        {this.renderListElements(listName)}
        <div>
          <i className="add-icon fa fa-plus-circle" data-list-name={listName} data-new-value="x" onClick={this.handleListElemAdd}/>
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
          <td><input type="checkbox" checked={col.chart} data-index={index} data-list-name="columns" data-prop-name="chart" onChange={this.handleListElemChange}/></td>
          <td><input type="text" style={{width: "50px"}} value={col.chartColor} data-index={index} data-list-name="columns" data-prop-name="chartColor" onChange={this.handleListElemChange}/></td>
          <td><i className="rm-icon fa fa-times-circle" data-index={index} data-list-name="columns" onClick={this.handleListElemRemove}/></td>
        </tr>
      )
    });
  }

  renderColumnsEditor() {
    return (
      <div className="edit-section">
        <table className="center">
          <tbody>
            <tr><th>Column heading</th><th>Read only</th><th>Chart</th><th>Color</th></tr>
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
    const { chartWidth, chartHeight } = this.state;
    const { initialInteractiveState } = this.props;
    return (
      <div className="authoring">
        <h3>Authoring</h3>
        <div className="authoring-section">
          {this.renderColumnsEditor()}
          {this.renderListEditor('Labels', 'labels')}
          <div className="edit-section">
            <p>Graph dimensions</p>
            <table>
            <tbody>
              <tr><td>Width</td><td><input type="range" min="150" max="800" name="chartWidth" value={chartWidth} onChange={this.handleInputChange}/></td><td>{chartWidth} px</td></tr>
              <tr><td>Height</td><td><input type="range" min="150" max="600" name="chartHeight" value={chartHeight} onChange={this.handleInputChange}/></td><td>{chartHeight} px</td></tr>
            </tbody>
            </table>
          </div>
        </div>
        <h3>Preview</h3>
        <div className="preview">
          <Runtime authoredState={this.authoredState} initialInteractiveState={initialInteractiveState}/>
        </div>
      </div>
    );
  }
}

Authoring.defaultProps = {
  onAuthoredStateChange: function (state) {}
};
