import React, { Fragment, Component } from 'react';
import './ArrowDown.css';

export class ArrowDown extends Component {
    constructor() {
        super();
        this.state = {

        }
    }
    render() {
        const { displayList, timePassed, setLanguage, type } = this.props;
        return (
            <Fragment>
                <div 
                    onClick={() => displayList(setLanguage, type)} 
                    className={`arrowDown ${timePassed[type] ? 'active' : ''}`}
                />
            </Fragment>
        );
    }
}