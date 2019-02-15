import React, { Component, Fragment } from 'react';
import { HistoryListItem } from '../historyListItem/HistoryListItem';
import './HistoryList.css';

export class HistoryList extends Component {
    constructor() {
        super();
        this.state = {

        }
    }
    render() {
        const { translateHistory = [], langsList, backHistoryEntry } = this.props;
        return (
            <Fragment>
                <div className="history-list">
                    <h1>История</h1>
                    <div className="translate-history">

                        {translateHistory.map(({key, from, to, text, finalText}) => {
                            
                            return (
                                <HistoryListItem 
                                    key={key}
                                    langsList={langsList}
                                    fromLang={from}
                                    toLang={to}
                                    originPhrase={text}
                                    translatedPhrase={finalText}
                                    backHistoryEntry={backHistoryEntry}
                                />
                            );
                        })

                        }
                        
                    </div>
                </div>
            </Fragment>
        )
    }
}