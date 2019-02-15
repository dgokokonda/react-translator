import React, { Fragment, Component } from 'react';
import { LangTitle } from '../langTitle/LangTitle';
import { ArrowDown } from '../arrowDown/ArrowDown';
import { HistoryBtn } from '../historyBtn/HistoryBtn';

export class ToLang extends Component {
    constructor() {
        super();
        this.state = {
        }
    }
    
    render() {
        const { languages, displayList, timePassed, setFinalLangCode, toCodeLang, displayHistory } = this.props;
        return (
            <Fragment>
                {languages ? languages.map((lang) => (
                    <LangTitle 
                        key={lang.code}
                        codeLang={toCodeLang} 
                        setLanguage={setFinalLangCode}
                        title={lang.name}
                        code={lang.code} />
                )) : null}
                    <ArrowDown 
                        displayList={displayList}
                        timePassed={timePassed}
                        setLanguage={setFinalLangCode}
                        type={'to'}
                    />
                    <HistoryBtn displayHistory={displayHistory} />
            </Fragment>
        );
    }
}