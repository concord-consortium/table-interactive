import React, {PureComponent} from 'react';
import Authoring from './authoring';
import Runtime from './runtime';
import iframePhone from 'iframe-phone';

import '../../css/app.less';
import 'font-awesome/css/font-awesome.css'

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'authoring' // null, 'authoring' or 'runtime'
    };
    this.initInteractive = this.initInteractive.bind(this);
  }

  componentDidMount() {
    this.phone = iframePhone.getIFrameEndpoint();
    this.phone.addListener('initInteractive', this.initInteractive);
    // Initialize connection after all message listeners are added!
    this.phone.initialize();
  }

  componentWillUnmount() {
    this.phone.disconnect();
  }

  initInteractive(data) {
    this.setState({
      mode: data.mode,
      authoredState: data.authoredState,
      interactiveState: data.interactiveState
    });
  }

  render() {
    const { mode, authoredState, interactiveState } = this.state;
    return (
      <div>
        {mode === null && <p>Waiting for iframe-phone initInteractive call...</p>}
        {mode === 'authoring' && <Authoring authoredState={authoredState}/>}
        {mode === 'runtime' && <Runtime authoredState={authoredState} interactiveState={interactiveState}/>}
      </div>
    );
  }
}
