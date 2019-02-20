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
        const { translateData, setLangTitle, displayList, setOriginLangCode, setFinalLangCode, detectLanguage, detectedLang, title, langsList, displayHistory } = this.props;
        return (
            <Fragment>
                <div className="header">
                    <div className="fromLang">
                        <FromLang 
                            languages={translateData.from.languages}
                            fromCodeLang={translateData.from.codeLang} 
                            displayList={displayList}
                            timePassed={translateData.from.timePassed}
                            setOriginLangCode={setOriginLangCode}
                            detectLanguage={detectLanguage}
                            title={title}
                            langsList={langsList}
                        />
                    </div>
                    <SwapBtn 
                        timePassed={translateData.to.timePassed}
                        languages={translateData.to.languages} 
                        fromCodeLang={translateData.from.codeLang}
                        toCodeLang={translateData.to.codeLang}
                        detectedLang={detectedLang}
                        setLangTitle={setLangTitle}
                    />
                    <div className="toLang">
                        <ToLang 
                            languages={translateData.to.languages}
                            toCodeLang={translateData.to.codeLang} 
                            displayList={displayList}
                            timePassed={translateData.to.timePassed}
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