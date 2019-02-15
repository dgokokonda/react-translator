import React, { Component, Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
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
            // translateData: {
            //     'from': {
            //         codeLang: 'ru',
            //         text: '',
            //         languages: [
            //             {
            //                 code: '',
            //                 name: 'Определить язык'
            //             }, {
            //                 code: 'ru',
            //                 name: 'Русский'
            //             }, {
            //                 code: 'en',
            //                 name: 'Английский'
            //             }, {
            //                 code: 'de',
            //                 name: 'Немецкий'
            //             }
            //         ],
            //         timePassed: false,
            //     },
            //     'to': {
            //         codeLang: 'en',
            //         text: '',
            //         languages: [
            //             {
            //                 code: 'en',
            //                 name: 'Английский'
            //             }, {
            //                 code: 'ru',
            //                 name: 'Русский'
            //             }, {
            //                 code: 'uk',
            //                 name: 'Украинский'
            //             }
            //         ],
            //         timePassed: false,
            //     }
            // },
            timePassed: {
                'from': false,
                'to': false
            },
            fromCodeLang: '',
            toCodeLang: '',
            originText: '',
            translatedText: '',
            detectedLang: '',
            languages: {
                'from': [
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
                'to': [
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
                ]
            },
            translateHistory: [],
            visibleHistory: false,
        }
    }
    displayList = (callback, type) => {
        let that = this;

        this.setState({
            visible: !this.state.visible,
            callbackData: {
                'callback' : callback,
                'type': type
            },
            timePassed: {
                ...this.state.timePassed,
                [type]: !this.state.timePassed[type]
            }
        });

        setTimeout(function() {
            that.setState({
                timePassed: {
                    ...that.state.timePassed,
                    [type]: !that.state.timePassed[type]
                }
            })
        }, 200);
    }
    setLangTitle = (code, name, type, from, to) => {
        switch (type) {
            case 'from':
                this.setState({
                    languages: {
                        'from': [
                            {...this.state.languages.from[0]
                            }, {
                                code: code, 
                                name: name
                            },
                            ...this.state.languages.from.slice(1, this.state.languages.from.length - 1)
                        ],
                        'to': [...this.state.languages.to]
                    }
                });
                break;
            case 'to':
                this.setState({
                    languages: {
                        'from': [...this.state.languages.from],
                        'to': [
                            {
                                code: code, 
                                name: name
                            },
                            ...this.state.languages.to.slice(0, this.state.languages.to.length - 1)
                        ]
                    }
                });
                break;
            case 'detect':
                this.setState({
                    languages: {
                        'from': [
                            {
                                code: '', 
                                name: `${name} (определен автоматически)`
                            }, 
                            ...this.state.languages.from.slice(1)
                        ],
                        'to': [...this.state.languages.to]
                    }
                });
                break;
            case 'switch':
                const param1 = (this.checkForSameKeys('from', from) === 0) ? 
                    [
                        {
                            code: '',
                            name: 'Определить язык'
                        }, {
                            code: from,
                            name: this.state.langsList.langs[from]
                        },
                        ...this.state.languages.from.filter((lang) => {
                            if (lang.code === to) {
                                this.state.languages.from.splice(lang, 1);
                            }
                        }),
                        ...this.state.languages.from.filter(({code}) => (code !== from && code !== '' && code !== to))
                    ] 
                    : [
                        {
                            code: '',
                            name: 'Определить язык'
                        },
                        ...this.state.languages.from.slice(1)
                    ];
                const param2 = (this.checkForSameKeys('to', to) === 0) ? 
                [
                    {
                        code: to,
                        name: this.state.langsList.langs[to]
                    },
                    ...this.state.languages.to.filter((lang) => {
                        if (lang.code === from) {
                            this.state.languages.to.splice(lang, 1);
                        }
                    }),
                    ...this.state.languages.to.filter(({code}) => (code !== to))
                ] : [
                    ...this.state.languages.to
                ];

                this.setState({
                    languages: {
                        'from': param1,
                        'to': param2
                    },
                    fromCodeLang: from,
                    toCodeLang: to,
                    detectedLang: '',
                    originText: this.state.translatedText ? this.state.translatedText.text[0] : ''
                });
                history.push({
                    pathname: '/',
                    search: `?fl=${from}&tl=${to}&text=${this.state.originText}`
                });
                if (this.state.translatedText) {
                    this.translateText(this.state.translatedText.text[0], from, to);
                } 
                break;
            default:
                break;
        }
    }
    setOriginLangCode = (code, type) => {
        this.setState({
            fromCodeLang: code,
            visible: false
        });
        this.setNoSameKey(type, code);
        if (!code && this.state.originText) {
            this.detectLanguage(this.state.originText);
        }
        if (code) {
            this.state.languages.from[0].name = 'Определить язык'; // pardon
            this.setState({detectedLang: ''})
        }
    }
    setFinalLangCode = (code, type) => {
        this.setState({
            toCodeLang: code,
            visible: false
        });
        this.setNoSameKey(type, code);
        if (this.state.originText) {
            this.translateText(this.state.originText, this.state.fromCodeLang, code);
        }
    }
    setNoSameKey = (type, code) => {
        if (this.checkForSameKeys(type, code) === 0) {
            this.setLangTitle(code, this.state.langsList.langs[code], type);
        }
    }
    checkForSameKeys = (type, code) => {
        let count = 0;
        if (type) {
            this.state.languages[type].filter((lang) => (lang.code === code ? count++ : count ));
        }
        return count;
    }
    checkValue = (value) => {
        this.setState({originText: value});
        this.state.fromCodeLang ? this.translateText(value) : this.detectLanguage(value);
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
                    this.setLangTitle('', this.state.langsList.langs[detectedLang.lang], 'detect');
                    this.translateText(text, detectedLang.lang, this.state.toCodeLang);
                }
                
            }); 
            
        }
    }, 500)
    translateText = debounce((text, from, to, historyData) => {
        const date = new Date();
        if (text) {
            fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${this.state.apiKey}&text=${text}&lang=${from || this.state.fromCodeLang || this.state.detectedLang}-${to || this.state.toCodeLang}`)
            .then((res) => res.json())
            .then((translatedText) => this.setState({
                translatedText,
                translateHistory: historyData ? historyData : [
                    {
                        key: date.getTime(),
                        from: from || this.state.fromCodeLang, 
                        to: to || this.state.toCodeLang, 
                        text,
                        finalText: translatedText.text[0]
                    },
                    ...this.state.translateHistory
                ]
            }))
            .catch((res) => console.log('status: ', res.status));
        } else {
            this.setState({translatedText: ''});
        }
        history.push({
            pathname: '/',
            search: `?fl=${from || this.state.fromCodeLang || this.state.detectedLang}&tl=${to || this.state.toCodeLang}&text=${text}`
        });
    }, 500)
    displayHistory = (visibleHistory) => {
        this.setState({visibleHistory});
    }
    backHistoryEntry = (fromCodeLang, toCodeLang, originText) => {
        this.setState({
            fromCodeLang,
            toCodeLang,
            originText
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
            fromCodeLang: params.get('fl') ? params.get('fl') : 'ru',
            toCodeLang: params.get('tl') ? params.get('tl') : 'en',
            originText: params.get('text') ? params.get('text') : ''
        });
        fetch(`https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${this.state.apiKey}&ui=ru`)
        .then((res) => res.json())
        .then((langsList) => {
            this.setState({langsList});
            if (this.state.originText) {
                this.translateText(params.get('text'), params.get('fl'), params.get('tl'));
            } 
        })
        .catch((res) => console.log('status: ', res.status));
    }
    render() {
        const { fromCodeLang, toCodeLang, detectedLang, languages, visible, langsList, timePassed, callbackData, translatedText, originText,visibleHistory, translateHistory } = this.state;

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
                                languages={languages}
                                displayList={this.displayList}
                                fromCodeLang={fromCodeLang}
                                toCodeLang={toCodeLang}
                                detectedLang={detectedLang}
                                timePassed={timePassed}
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
                                    value={originText ? originText : ''}
                                    enterForTranslate={this.enterForTranslate}
                                />
                                <Textarea
                                    key="1"
                                    value={translatedText ? translatedText.text[0] : ''}
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
