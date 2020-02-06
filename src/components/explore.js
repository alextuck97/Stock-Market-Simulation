import React from 'react';
import {Table, Container, Row, Col} from 'react-bootstrap';
import './explore.css';


class Explore extends React.Component {

    render () {
        return (
            <Container className="explore-container">
                <Row>
                    <Col id="stock-table-column" className="col-lg-10"><StockTable /></Col>
                    <Col>Other information goes hertuf</Col>
                </Row>
            </Container>
            
        )
    }
}


class StockTable extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            stocks : [
                createStock("MSFT", "87", 0.05, -2.21, 5.55),
                createStock("TWTR", 9, 0.05, -2.21, 5.55),
                createStock("AAPL", 47, 0.09, -9.23, 8.55)
            ],

            more_stocks : Array(50).fill(createStock("MSFT", "87", 0.05, -2.21, 5.55)),
        }
    }


    renderTableData() {
        return this.state.more_stocks.map((stock, index) => {
            const {symbol, price, day, month, year} = stock;
            return (
                <tr key={symbol}>
                    <td>{symbol}</td>
                    <td>{price}</td>
                    <td>{day}</td>
                    <td>{month}</td>
                    <td>{year}</td>
                </tr>
            )

        })
    }


    render() {
        return(
            <Table id="stock-table" striped hover>
                <thead id="table-head">
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Day</th>
                    <th>Month</th>
                    <th>Month</th>
                </thead>
                <tbody>
                    {this.renderTableData()}
                </tbody>
            </Table>
        )
    }
}


function createStock(symbol, price, day, month, year) {
    return ({
        symbol : symbol, 
        price : price,
        day : day,
        month : month,
        year : year
    });
}


export default Explore;