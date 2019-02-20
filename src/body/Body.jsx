import React, { Component, Fragment } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { debounce } from 'lodash';
import './Body.css';
import { Header } from '../header/Header';
import { LangList } from '../lang-list/LangList';
import { Textarea } from '../textarea/Textarea';
import { HistoryList } from '../historyList/HistoryList';

const history = createBrowserHistory();
const location = history.location;


export class Body extends Component {
    constructor() {
        super();
        this.state = {
            apiKey : 'trnsl.1.1.20180403T163329Z.3613ac73aaddf465.e8d2539a6dee37cead81fe5adccf4f7c69efa42a',
            visible: false,
            callbackData: {
                'callback': null,
                'type': null
            },
            translateData: {
                'from': {
                    codeLang: 'ru',
                    text: '',
                    languages: [
                        {
                            code: '',
                            name: 'Определить язык'
                        }, {
                            code: 'ru',
                            name: 'Русский'
                        }, {
                            code: 'en',
                            name: 'Английский'
                        }, {
                            code: 'de',
                            name: 'Немецкий'
                        }
                    ],
                    timePassed: false,
                },
                'to': {
                    codeLang: 'en',
                    text: '',
                    languages: [
                        {
                            code: 'en',
                            name: 'Английский'
                        }, {
                            code: 'ru',
                            name: 'Русский'
                        }, {
                            code: 'uk',
                            name: 'Украинский'
                        }
                    ],
                    timePassed: false,
                }
            },
            detectedLang: '',
            translateHistory: [],
            visibleHistory: false,
        }
    }

    displayList = (callback, type) => {
        let that = this;

        this.setState({
            visible: !this.state.visible,
            callbackData: {
                'callback': callback,
                'type': type
            },
            translateData: {
                ...this.state.translateData,
                [type]: {
                    ...this.state.translateData[type],
                    timePassed: !this.state.translateData[type].timePassed
                }
            }
        });

        setTimeout(function() {
            that.setState({
                translateData: {
                    ...that.state.translateData,
                    [type]: {
                        ...that.state.translateData[type],
                        timePassed: !that.state.translateData[type].timePassed
                    }
                },
            })
        }, 200);
    }

    setLangTitle = (code, name, type, from, to) => {
        
        switch (type) {
            case 'from':
                const paramF = (this.checkForSameKeys(type, code)) ? {
                    ...this.state.translateData,
                    'from': {
                        ...this.state.translateData.from,
                        languages: [
                            {
                                code: '',
                                name: 'Определить язык'
                            },
                            ...this.state.translateData.from.languages.filter((lang) => lang.code !== '')
                        ],
                        codeLang: code
                    }
                } : {
                    ...this.state.translateData,
                    'from': {
                        ...this.state.translateData.from,
                        languages: [
                            {
                                code: '',
                                name: 'Определить язык'
                            }, {
                                code: code,
                                name: name
                            },
                            ...this.state.translateData.from.languages.filter((lang, item) => lang.code !== code && lang.code !== '' && item < 3)
                        ],
                        codeLang: code
                    }
                }
                this.setState({
                    translateData: paramF
                });
                break;
            case 'to':
                const paramT = (this.checkForSameKeys(type, code)) ? {
                    ...this.state.translateData,
                    'to': {
                        languages: [
                            {
                                code: code,
                                name: name
                            },
                            ...this.state.translateData.to.languages.filter((lang, item) => lang.code !== code && item < 3)
                        ],
                        codeLang: code
                    }
                } : {
                    ...this.state.translateData,
                    'to': {
                        languages: [
                            {
                                code: code,
                                name: name
                            },
                            ...this.state.translateData.to.languages.slice(0, 2)
                        ],
                        codeLang: code
                    }
            }
                this.setState({
                    translateData: paramT
                });
                break;
            case 'detect':
                this.setState({
                    translateData: {
                        ...this.state.translateData,
                        'from': {
                            ...this.state.translateData.from,
                            languages: [
                                {
                                    code: '',
                                    name: `${name} (определен автоматически)`
                                },
                                ...this.state.translateData.from.languages.slice(1)
                            ]
                        }
                    }
                });
                break;
            case 'switch':
                if (to) {
                    const param1 = (this.checkForSameKeys('from', from) === 0) ? 
                        [
                            {
                                code: '',
                                name: 'Определить язык'
                            }, {
                                code: from,
                                name: this.state.langsList.langs[from]
                            },
                            ...this.state.translateData.from.languages.filter((lang) => {
                                if (lang.code === to) {
                                    this.state.translateData.from.languages.splice(lang, 1);
                                }
                            }),
                            ...this.state.translateData.from.languages.filter(({code}) => (code !== from && code !== '' && code !== to))
                        ]
                        : [
                            {
                                code: '',
                                name: 'Определить язык'
                            },
                            ...this.state.translateData.from.languages.slice(1)
                        ];
                    const param2 = (this.checkForSameKeys('to', to) === 0) ? 
                        [
                            {
                                code: to,
                                name: this.state.langsList.langs[to]
                            }, 
                            ...this.state.translateData.to.languages.filter((lang) => {
                                if (lang.code === from) {
                                    this.state.translateData.to.languages.splice(lang, 1);
                                }
                            }),
                            ...this.state.translateData.to.languages.filter(({code}) => (code !== to))
                        ]
                        : [
                            ...this.state.translateData.to.languages,
                        ];
                    
                    this.setState({
                        translateData: {
                            'from': {
                                ...this.state.translateData.from,
                                codeLang: from,
                                text: this.state.translateData.to.text || '',
                                languages: param1
                            },
                            'to': {
                                ...this.state.translateData.to,
                                codeLang: to,
                                languages: param2
                            }
                        },
                        detectedLang: '',
                    });
                    if (this.state.translateData.to.text) {
                        this.translateText(this.state.translateData.to.text, from, to);
                    }
                }
                break;
                
            default:
                break;
        }
        history.push({
            pathname: '/',
            search: `?fl=${from || code}&tl=${to || this.state.translateData.to.codeLang}&text=${this.state.translateData.from.text}`,
            // state: {translateHistory: this.state.translateHistory}
        });
    }

    setOriginLangCode = (code, type='from') => {
        this.setState({
            visible: false
        });

        this.setLangTitle(code, this.state.langsList.langs[code], type);
        if (!code && this.state.translateData.from.text) {
            this.detectLanguage(this.state.translateData.from.text);
        }
    }

    setFinalLangCode = (code, type='to') => {
        this.setState({
            visible: false
        });

        this.setLangTitle(code, this.state.langsList.langs[code], type);
        if (this.state.translateData.from.text) {
            this.translateText(
                this.state.translateData.from.text, 
                this.state.translateData.from.codeLang, 
                code
            );
        }
    }

    checkForSameKeys = (type, code) => {
        let count = 0;
        if (type) {
            this.state.translateData[type].languages.filter((lang) => (lang.code === code ? count++ : count ));
        }
        return count;
    }

    checkValue = (value) => {
        this.setState({
            translateData: {
                ...this.state.translateData,
                'from': {
                    ...this.state.translateData.from,
                    text: value
                }
            }
        });

        this.state.translateData.from.codeLang ? 
        this.translateText(value) : 
        this.detectLanguage(value);
    };

    enterForTranslate = (e) => {
        e = e || window.event;
        var charCode = e.charCode || e.keyCode;
        if (charCode === 13 && e.target.value) {
            this.translateText(e.target.value);
        }
    }

    detectLanguage = debounce((text) => {
        if (text) {
            fetch(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=${this.state.apiKey}&text=${text}`)
            .then((res) => res.json())
            .then((detectedLang) => {
                if (detectedLang.lang) {
                    this.setState({
                        detectedLang : detectedLang.lang
                    });
                    this.setLangTitle(
                        this.state.translateData.from.codeLang, 
                        this.state.langsList.langs[detectedLang.lang], 
                        'detect'
                    );
                    this.translateText(
                        text, 
                        this.state.translateData.from.codeLang, 
                        this.state.translateData.to.codeLang
                    );
                }
            }); 
        } else {
            this.setState({
                translateData: {
                    ...this.state.translateData,
                    'to': {
                        ...this.state.translateData.to,
                        text: ''
                    }
                },
            });
        }
    }, 500)

    translateText = debounce((text, from, to, historyData) => {
        if (text) {
            fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${this.state.apiKey}&text=${text}&lang=${from || this.state.translateData.from.codeLang || this.state.detectedLang}-${to || this.state.translateData.to.codeLang}`)
            .then((res) => res.json())
            .then((translatedText) => this.setState({
                translateData: {
                    'from': {
                        ...this.state.translateData.from,
                        codeLang: from || this.state.translateData.from.codeLang, 
                        text
                    },
                    'to': {
                        ...this.state.translateData.to,
                        codeLang: to || this.state.translateData.to.codeLang,
                        text: translatedText.text[0]
                    }
                },
                translateHistory: this.setHistory(
                    text,
                    from || this.state.translateData.from.codeLang,
                    to || this.state.translateData.to.codeLang,
                    translatedText.text[0],
                    historyData
                )
            }))
            .catch((res) => console.log('status: ', res.status));
        } else {
            this.setState({
                translateData: {
                    ...this.state.translateData,
                    'to': {
                        ...this.state.translateData.to,
                        text: ''
                    }
                },
            });
        }
        history.push({
            pathname: '/',
            search: `?fl=${from || this.state.translateData.from.codeLang || this.state.detectedLang}&tl=${to || this.state.translateData.to.codeLang}&text=${this.state.translateData.from.text}`,
            // state: {translateHistory: this.state.translateHistory}
        });
    }, 500);

    setHistory = (originText, from, to, finalText, historyData) => {
        let count = 0;
        let newHistoryData = this.state.translateHistory;

        this.state.translateHistory.filter(({text}) => (
            text === originText ? count++ : count 
        ));
        if (count) {
            newHistoryData = [
                ...this.state.translateHistory.filter(({text}) => (text === originText)),
                ...this.state.translateHistory.filter(({text}) => (text !== originText)),
            ]
        }
        if (!count && !historyData) { // временно, пока historyData не хранит все данные до перезагрузки
            const date = new Date();
            newHistoryData = [
                {
                    key: date.getTime(),
                    from, 
                    to, 
                    text: originText,
                    finalText
                },
                ...this.state.translateHistory 
            ]
        }
        return historyData || newHistoryData;
    }

    displayHistory = (visibleHistory) => {
        this.setState({visibleHistory});
    }

    backHistoryEntry = (fromCodeLang, toCodeLang, originText) => {
        this.setState({
            translateData: {
                'from': {
                    ...this.state.translateData.from,
                    codeLang: fromCodeLang,
                    text: originText
                },
                'to': {
                    ...this.state.translateData.to,
                    codeLang: toCodeLang
                }
            }
        });
        this.translateText(
            originText, 
            fromCodeLang, 
            toCodeLang, 
            this.state.translateHistory
        );
    }

    componentWillMount() {
        this.translateText.cancel() 
        || this.detectLanguage.cancel();
    }

    componentDidMount = () => {
        const params = new URLSearchParams(location.search);

        this.setState({
            translateData: {
                'from': {
                    ...this.state.translateData.from,
                    codeLang: params.get('fl') ? params.get('fl') : 'ru',
                    text: params.get('text') ? params.get('text') : ''
                },
                'to': {
                    ...this.state.translateData.to,
                    codeLang: params.get('tl') ? params.get('tl') : 'en'
                }
            }
        });
        fetch(`https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${this.state.apiKey}&ui=ru`)
        .then((res) => res.json())
        .then((langsList) => {
            this.setState({langsList});

            if (this.state.translateData.from.text) {
                this.translateText(params.get('text'), params.get('fl'), params.get('tl'));
            } 
        })
        .catch((res) => console.log('status: ', res.status));
    }

    render() {
        const { translateData, detectedLang, visible, langsList, callbackData, visibleHistory, translateHistory } = this.state;

        return (
            <Router history={history}>
                <Fragment>
                    <div className="main">
                        <div className="title">
                            <div>Translator</div>
                        </div>
                        <div className="layer1"></div>
                        <div className="layer2"></div>
                        <div className="layer3">
                            <Header 
                                translateData={translateData}
                                displayList={this.displayList}
                                detectedLang={detectedLang}
                                detectLanguage={this.detectLanguage}
                                setLangTitle={this.setLangTitle}
                                setOriginLangCode={this.setOriginLangCode}
                                setFinalLangCode={this.setFinalLangCode}
                                langsList={langsList}
                                displayHistory={this.displayHistory}
                            />
                            <LangList 
                                visible={visible}
                                langsList={langsList}
                                setLanguage={callbackData.callback}
                                type={callbackData.type}
                            />
                            <div className={visible ? 'content hideContent' : 'content'}>
                                <Textarea
                                    key="0"
                                    onChange={this.checkValue}
                                    value={translateData.from.text|| ''}
                                    enterForTranslate={this.enterForTranslate}
                                />
                                <Textarea
                                    key="1"
                                    value={translateData.to.text || ''}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className={`layer4 ${visibleHistory ? 'viewHistory' : ''}`}>
                            <HistoryList 
                                translateHistory={translateHistory}
                                langsList={langsList} 
                                backHistoryEntry={this.backHistoryEntry}
                            />
                        </div>
                    </div>
                </Fragment>
            </Router>
        );
    }
}
