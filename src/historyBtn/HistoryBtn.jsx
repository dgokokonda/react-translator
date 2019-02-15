import React, { Fragment, Component } from 'react';
import './HistoryBtn.css';

export class HistoryBtn extends Component {
    constructor() {
        super();
        this.state = {
            visible: false
        }
    }
    setView = () => {
        this.setState({visible: !this.state.visible});
        this.props.displayHistory(!this.state.visible)
    }
    render() {
        return (
            <Fragment>
                <div className="history-btn" onClick={this.setView}></div>
            </Fragment>
        )
    }
}