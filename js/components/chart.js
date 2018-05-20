import React, { PureComponent } from 'react'
import { Bar } from 'react-chartjs-2'

const DEF_COLOR = '#ff6384'
const UPDATE_DELAY = 350 // ms
const LABEL_LINE_MAX = 12

const splitLabel = label => {
  if (label.length > LABEL_LINE_MAX) {
    const firstLine = label.substring(0, LABEL_LINE_MAX)
    const breakIndex = firstLine.lastIndexOf(' ')
    if (breakIndex === -1 || breakIndex < LABEL_LINE_MAX * 0.5) {
      return [firstLine].concat(splitLabel(label.substring(LABEL_LINE_MAX)))
    }
    else {
      return [label.substring(0, breakIndex)].concat(splitLabel(label.substring(breakIndex)))
    }
  }
  return label
}

export default class Chart extends PureComponent {
  get chartData () {
    const {name, labels, data, color} = this.props

    // Split label into 2 lines if it's too long
    const splitLabels = labels.map(splitLabel)

    return {
      labels: splitLabels,
      datasets: [{
        label: name,
        backgroundColor: color || DEF_COLOR,
        data
      }]
    }
  }

  getOptions (props) {
    const {xLabel, name} = props
    return {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: name
          },
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: xLabel
          }
        }]
      },
      animation: false
    }
  }

  getKey (props) {
    let {width, height} = props
    return `${width}${height}${JSON.stringify(this.getOptions(props))}`
  }

  shouldComponentUpdate (nextProps) {
    // Rendering of this component might be slow when we need to recreate graph element
    // (and that happens when key is changed).
    if (this.getKey(this.props) !== this.getKey(nextProps)) {
      clearTimeout(this._timeoutId)
      this._timeoutId = setTimeout(() => {
        this.forceUpdate()
      }, UPDATE_DELAY)
      return false
    }
    return true
  }

  render () {
    let {width, height} = this.props
    width = parseInt(width)
    height = parseInt(height)
    const options = this.getOptions(this.props)
    // Little hack - react-chart-2 doesn't work well when you dynamically change width, height or options properties.
    // So, if we provide `key` based on width and height, it will force React to completely recreate this element.
    // See: https://github.com/gor181/react-chartjs-2/issues/40
    const barGraphKey = this.getKey(this.props)
    return (
      <div className="chart" style={{width: `${width}px`, height: `${height}px`}}>
        <Bar key={barGraphKey} width={width} height={height} data={this.chartData} options={options}/>
      </div>
    )
  }
}

Chart.defaultProps = {
  width: 300,
  height: 240,
  name: 'Test data',
  xLabel: 'X label',
  color: DEF_COLOR,
  labels: [1, 2, 3],
  data: [0, 1, 2]
}
