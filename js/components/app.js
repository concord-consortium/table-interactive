import React, {PureComponent} from 'react';
import Authoring from './authoring';
import Runtime from './runtime';
import getURLParam from '../get-url-param';
import iframePhone from 'iframe-phone';

import '../../css/app.less';
import 'font-awesome/css/font-awesome.css'

const DEFAULT_AUTHORED_STATE = {
  columns: [
    {
      heading: 'Labels',
      readOnly: true,
      chart: false
    },
    {
      heading: 'Description',
      readOnly: false,
      chart: false
    },
    {
      heading: 'Value 1',
      readOnly: false,
      chart: true
    },
    {
      heading: 'Value 2',
      readOnly: false,
      chart: true,
      chartColor: '#009688'
    }
  ],
  labels: ['a', 'b', 'c'],
  chartWidth: 300,
  chartHeight: 240
};

const DEFAULT_INTERACTIVE_STATE = {
  data: null
};

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mode: getURLParam('mode'), // null, 'authoring' or 'runtime',
      authoredState: DEFAULT_AUTHORED_STATE,
      interactiveState: DEFAULT_INTERACTIVE_STATE
    };
    this.initInteractive = this.initInteractive.bind(this);
    this.sendLearnerUrl = this.sendLearnerUrl.bind(this);
    this.handleAuthoredStateChange = this.handleAuthoredStateChange.bind(this);
    this.handleInteractiveStateChange = this.handleInteractiveStateChange.bind(this);
  }

  componentDidMount() {
    this.phone = iframePhone.getIFrameEndpoint();
    this.phone.addListener('initInteractive', this.initInteractive);
    this.phone.addListener('getLearnerUrl', this.sendLearnerUrl);
    // Initialize connection after all message listeners are added!
    this.phone.initialize();
  }

  componentWillUnmount() {
    this.phone.disconnect();
  }

  initInteractive(data) {
    this.setState({
      mode: data.mode,
      authoredState: data.authoredState || DEFAULT_AUTHORED_STATE,
      interactiveState: data.interactiveState || DEFAULT_INTERACTIVE_STATE
    });
  }

  sendLearnerUrl() {
    // Required by LARA. In the future we might want to send versioned URL or just remove it.
    this.phone.post('setLearnerUrl', window.location.href);
  }

  handleAuthoredStateChange(state) {
    this.phone.post('authoredState', state);
  }

  handleInteractiveStateChange(state) {
    this.phone.post('interactiveState', state);
  }

  render() {
    const { mode, authoredState, interactiveState } = this.state;
    return (
      <div>
        {mode === null && <p>Waiting for iframe-phone initInteractive call...</p>}
        {mode === 'authoring' &&
          <Authoring initialAuthoredState={authoredState} initialInteractiveState={DEFAULT_INTERACTIVE_STATE}
                     onAuthoredStateChange={this.handleAuthoredStateChange}/>
        }
        {mode === 'runtime' &&
          <Runtime authoredState={authoredState} initialInteractiveState={interactiveState}
                   onInteractiveStateChange={this.handleInteractiveStateChange}/>}
      </div>
    );
  }
}
