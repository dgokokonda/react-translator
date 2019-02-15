import React, { Fragment, Component } from 'react';
import { FromLang } from '../from-lang/FromLang';
import { ToLang } from '../to-lang/ToLang';
import { SwapBtn } from '../swap-btn/SwapBtn';
import './Header.css';

export class Header extends Component {
    constructor() {
        super();
        this.state = {
        }
    }
    
    render() {
        const { languages, setLangTitle, displayList, timePassed, setOriginLangCode, setFinalLangCode, detectLanguage, fromCodeLang, toCodeLang, detectedLang, title, langsList, displayHistory } = this.props;
        return (
            <Fragment>
                <div className="header">
                    <div className="fromLang">
                        <FromLang 
                            languages={languages.from}
                            fromCodeLang={fromCodeLang} 
                            displayList={displayList}
                            timePassed={timePassed}
                            setOriginLangCode={setOriginLangCode}
                            detectLanguage={detectLanguage}
                            title={title}
                            langsList={langsList}
                        />
                    </div>
                    <SwapBtn 
                        timePassed={timePassed}
                        languages={languages} 
                        fromCodeLang={fromCodeLang}
                        toCodeLang={toCodeLang}
                        detectedLang={detectedLang}
                        setLangTitle={setLangTitle}
                    />
                    <div className="toLang">
                        <ToLang 
                            languages={languages.to}
                            toCodeLang={toCodeLang} 
                            displayList={displayList}
                            timePassed={timePassed}
                            setFinalLangCode={setFinalLangCode}
                            title={title}
                            langsList={langsList}
                            displayHistory={displayHistory}
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}