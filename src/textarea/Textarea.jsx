import React, { Fragment, Component } from 'react';
import './Textarea.css';

export class Textarea extends Component {
    constructor() {
        super();
        this.state = {
            value: ''
        }
    }
    handler = ({target: {value, offsetHeight, scrollHeight}}) => {
        const resizeVal = offsetHeight < scrollHeight ? scrollHeight - offsetHeight : 0;
        this.setState({
            value: this.props.value,
        });
        this.props.onChange(value);
        // resize textarea field:
        document.querySelectorAll('textarea').forEach((i) => i.style.minHeight = `${resizeVal + 170}px`);
    };

    render() {
        const { 
            value : textValue,
            disabled = false

        } = this.props;
        // defaultValue не рекомендуется использовать
        return (
            <Fragment>
                <textarea
                    placeholder={disabled ? 'Перевод' : ''}
                    disabled={disabled ? true : false}
                    className={`textarea ${disabled && textValue ? 'active' : ''}`}
                    value={textValue}
                    onChange={this.handler}
                >
                </textarea>
            </Fragment>
        );
    }
}