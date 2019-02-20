import React, { Fragment, Component } from 'react';
import './LangList.css';
import { LangListItem } from '../lang-list-item/LangListItem';

export class LangList extends Component {
    constructor() {
        super();
        this.state = {
            sortedList: [],
            count: 0
        }
    }
    getSortedLangsList = () => {
        if (this.props.langsList && this.state.count === 0) {
            let tempData = [];
            Object.keys(this.props.langsList.langs).map((lang) => tempData.push([lang, this.props.langsList.langs[lang]]));
            tempData.sort((a,b) => {return a[1] > b[1]});
            return tempData;
        }
    }
    componentDidUpdate = () => {
        if (this.props.langsList && this.state.count === 0) {
            this.setState({
                sortedList: this.getSortedLangsList(),
                count: 1
            });
        };
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
                        />
                        )) : null}
                    </div>
                </div>
            </Fragment>
        );
    }
}