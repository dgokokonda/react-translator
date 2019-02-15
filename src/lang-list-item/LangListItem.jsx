import React, { Fragment, Component } from 'react';
import './LangListItem.css';

export class LangListItem extends Component {
    constructor() {
        super();
        this.state = {
            
        }
    }
    render() {
        const { langText, code, setLanguage, type } = this.props;
        return (
            <Fragment>
                <div className="lang-list-item" onClick={() => setLanguage(code, type)}>
                    <span>{langText}</span>
                </div>
            </Fragment>
        );
    }
}