import React, { Component, Fragment } from 'react';
import './HistoryListItem.css';

export class HistoryListItem extends Component {
    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        const { langsList, fromLang, toLang, originPhrase, translatedPhrase, backHistoryEntry} = this.props;

        return(
            <Fragment>
                <div className="translate-item" onClick={() => backHistoryEntry(fromLang, toLang, originPhrase)}>
                    <div className="pair-languages">
                        <span className="pair-languages--from">{langsList.langs[fromLang]}</span>
                        <div className="arrow"></div>
                        <span className="pair-languages--to">{langsList.langs[toLang]}</span>
                    </div>
                    <div className="origin-phrase">{originPhrase}</div>
                    <div className="translated-phrase">{translatedPhrase}</div>
                </div>
            </Fragment>
        )
    }
}