import React, {PureComponent} from 'react';
import Authoring from './authoring';
import Runtime from './runtime';
import getURLParam from '../get-url-param';
import iframePhone from 'iframe-phone';
import Shutterbug from 'shutterbug';

import '../../css/app.less';
import 'font-awesome/css/font-awesome.css'

const DEFAULT_AUTHORED_STATE = {
  columns: [
    {
      heading: 'Trial',
      readOnly: true,
      average: false,
      chart: false,
      chartColor: ''
    },
    {
      heading: 'Description',
      readOnly: false,
      average: false,
      chart: false,
      chartColor: ''
    },
    {
      heading: 'Value 1 (unit)',
      readOnly: false,
      average: false,
      chart: true,
      chartColor: ''
    },
    {
      heading: 'Value 2 (unit)',
      readOnly: false,
      average: false,
      chart: true,
      chartColor: 'green'
    }
  ],
  labels: ['a', 'b', 'c'],
  chartWidth: 295,
  chartHeight: 240,
  rowLines: 1,
  chartAvgs: false
};

function validAuthoredState(state) {
  return state && state.columns
}

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
    this.getInteractiveState = this.getInteractiveState.bind(this);
    this.handleAuthoredStateChange = this.handleAuthoredStateChange.bind(this);
    this.handleInteractiveStateChange = this.handleInteractiveStateChange.bind(this);
  }

  componentDidMount() {
    Shutterbug.enable();
    this.phone = iframePhone.getIFrameEndpoint();
    this.phone.addListener('initInteractive', this.initInteractive);
    this.phone.addListener('getInteractiveState', this.getInteractiveState);
    // Initialize connection after all message listeners are added!
    this.phone.initialize();
  }

  componentWillUnmount() {
    Shutterbug.disable();
    this.phone.disconnect();
  }

  initInteractive(data) {
    const authoredState = typeof data.authoredState === 'string' ? JSON.parse(data.authoredState) : data.authoredState;
    const interactiveState = typeof data.interactiveState === 'string' ? JSON.parse(data.interactiveState) : data.interactiveState;
    this.setState({
      mode: data.mode,
      authoredState: validAuthoredState(authoredState) || DEFAULT_AUTHORED_STATE,
      interactiveState: interactiveState || DEFAULT_INTERACTIVE_STATE
    });
    this.phone.post('supportedFeatures', {
      apiVersion: 1,
      features: {
        authoredState: true,
        interactiveState: true
      }
    });
  }

  getInteractiveState(data) {
    // "nochange" is a special value supported by LARA which means the state hasn't changed
    var interactiveState = "nochange";
    if(this._currentInteractiveState) {
      interactiveState = this._currentInteractiveState;
    }
    this.phone.post('interactiveState', interactiveState);
  }

  handleAuthoredStateChange(state) {
    this.phone.post('authoredState', state);
  }

  handleInteractiveStateChange(state) {
    this._currentInteractiveState = state;
    this.phone.post('interactiveState', state);
  }

  render() {
    const { mode, authoredState, interactiveState } = this.state;
    const readOnly = mode === 'report';
    return (
      <div>
        {mode === null && <p>Waiting for iframe-phone initInteractive call...</p>}
        {mode === 'authoring' &&
          <Authoring initialAuthoredState={authoredState} initialInteractiveState={DEFAULT_INTERACTIVE_STATE}
                     onAuthoredStateChange={this.handleAuthoredStateChange}/>
        }
        {(mode === 'runtime' || mode === 'report') &&
          <Runtime authoredState={authoredState} initialInteractiveState={interactiveState} readOnly={readOnly}
                   onInteractiveStateChange={this.handleInteractiveStateChange}/>}
      </div>
    );
  }
}
