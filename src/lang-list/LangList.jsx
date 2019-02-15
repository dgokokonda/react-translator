import React, { Fragment, Component } from 'react';
import './LangList.css';
import { LangListItem } from '../lang-list-item/LangListItem';

export class LangList extends Component {
    constructor() {
        super();
        this.state = {
            sortedList: []
        }
    }
    componentDidUpdate = () => {
        if (this.props.langsList) {
            this.state.sortedList = [];
            this.getSortedLangsList()
        };
    }
    getSortedLangsList = () => {
        Object.keys(this.props.langsList.langs).map((lang) => this.state.sortedList.push([lang, this.props.langsList.langs[lang]]));
        this.state.sortedList.sort((a,b) => {return a[1] > b[1]});
    }

    render() {
        const { sortedList } = this.state;
        const { visible, setLanguage, type } = this.props;
        return (
            <Fragment>
                <div className={visible ? 'lang-list show' : 'lang-list'}>
                    <div>
                        {sortedList ? sortedList.map((lang) => (
                        <LangListItem 
                            key={lang[0]} 
                            code={lang[0]} 
                            langText={lang[1]} 
                            setLanguage={setLanguage}
                            type={type}
                        />)) : null}
                    </div>
                </div>
            </Fragment>
        );
    }
}