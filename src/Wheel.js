import React from 'react';

import './Wheel.css'
const RandomOrg = require('random-org');
const randomOrg = new RandomOrg({ apiKey: 'b558199b-0a92-43cb-991b-23551659a901' });
export default class Wheel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: null,
        };
        this.selectItem = this.selectItem.bind(this);
    }

    selectItem() {
        let self = this
        this.setState({ selectedItem: null })
        let selectedItem
        randomOrg.generateIntegers({ min: 1, max: this.props.items.length, n: 1 })
            .then(function (result) {
                selectedItem = result.random.data
                self.setState({ selectedItem })
                self.props.onSelectItem(selectedItem)
            });

    }

    render() {
        const { selectedItem } = this.state;
        const { items } = this.props;

        const wheelVars = {
            '--nb-item': items.length,
            '--selected-item': selectedItem,
        };
        const spinning = selectedItem !== null ? 'spinning' : '';

        return (
            <div className="wheel-container">
                <div className={`wheel ${spinning}`} style={wheelVars} onClick={this.selectItem}>
                    {items.map((item, index) => (
                        <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
