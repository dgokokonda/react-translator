import React, { Fragment, Component } from 'react';
import { LangTitle } from '../langTitle/LangTitle';
import { ArrowDown } from '../arrowDown/ArrowDown';

export class FromLang extends Component {
    constructor() {
        super();
        this.state = {
            
        }
    }
    render() {
        const { languages, displayList, timePassed, setOriginLangCode, fromCodeLang, title } = this.props;
        return (
            <Fragment>
                {languages ? languages.map((lang) => (
                    <LangTitle 
                        key={lang.code}
                        codeLang={fromCodeLang} 
                        setLanguage={setOriginLangCode}
                        title={title? title: lang.name}
                        code={lang.code} />
                )) : null}

                    <ArrowDown 
                        displayList={displayList}
                        timePassed={timePassed}
                        setLanguage={setOriginLangCode}
                        type={'from'}
                    />
            </Fragment>
        );
    }
}