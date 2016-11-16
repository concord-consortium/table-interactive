import React, {PureComponent} from 'react';
import Handsontable from 'handsontable';
import 'handsontable.css';

export default class ReactHandsontable extends PureComponent {
  componentDidMount() {
    this.hot = new Handsontable(this.refs.container, this.props);
  }

  componentWillUpdate(nextProps) {
    this.hot.updateSettings(nextProps);
  }

  render() {
    return (
      <div ref="container"></div>
    );
  }
}
