import React, { Fragment, Component } from 'react';
import './LangTitle.css';

export class LangTitle extends Component {
    constructor() {
        super();
        this.state = {
        }
    }
    render() {
        const { title, code, setLanguage, codeLang} = this.props;
        return (
            <Fragment>
                <div className={codeLang === code ? 'lang focused' : 'lang'} onClick={() => setLanguage(code)}>{title}</div>
            </Fragment>
        );
    }
}