import React, { Fragment, Component } from 'react';
import './SwapBtn.css';

export class SwapBtn extends Component {
    constructor() {
        super();
        this.state = {
            languages: ''
        }
    }
    switchLanquages = () => {
        this.props.setLangTitle(
            '', 
            '', 
            'switch',
            this.props.toCodeLang,
            this.props.fromCodeLang || this.props.detectedLang
        );
    }
    render() {
        return (
            <Fragment>
                <div className='swap-btn' onClick={this.switchLanquages}></div>
            </Fragment>
        );
    }
}