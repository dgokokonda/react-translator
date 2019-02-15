import React, { Fragment, Component } from 'react';
import './Textarea.css';

export class Textarea extends Component {
    constructor() {
        super();
        this.state = {
            value: ''
        }
    }
    handler = ({target: {value}}) => {
        this.setState({
            value: this.props.value,
        });
        this.props.onChange(value);

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