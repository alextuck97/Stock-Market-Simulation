import React from 'react';
import {Table, Container, Row, Col, Button, Form} from 'react-bootstrap';
import './explore.css';

const url = "http://127.0.0.1:8000/api/";

class Explore extends React.Component {
    /**
     * Parent component of the entire explore page.
     * Handles state of which stock s currently clicked.
     * 
     * @param {*} props 
     */
    constructor(props){
        super(props);
        this.tableClickHandler = this.tableClickHandler.bind(this);

        this.state = {
            clicked_stock : createStock("MSFT", 250, "-0.05", "+2.2", "+4.3"),
            key : null,
        }
        
    }

    tableClickHandler(stock, e) {
        e.preventDefault();
        const {symbol, price, day, month, year} = stock;
        var clicked_stock = createStock(symbol, price, day, month, year);
        this.setState({clicked_stock : clicked_stock});
    }

    render () {
        return (
            <Container className="explore-container" fluid>
                <Row>
                    <Col id="stock-table-column" className="col-lg-8"><StockTable clickHandler={this.tableClickHandler.bind(this)}/></Col>
                    <Col id="actions-column" className="stock-menu-container">
                        <StocksMenu stock={this.state.clicked_stock} key={this.state.key}/>
                    </Col>
                </Row>
            </Container>
            
        )
    }
}


class StocksMenu extends React.Component {
    /**
     * Menu on right hand side of page.
     * Has buttons and stuff to click.
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        this.state = {
            display : null,
            quantity_selected: null,
        }

    }


    onBuyClick() {
        let request = new XMLHttpRequest();

        request.open("POST", url + "transaction/");
        const body = {
            "symbol": this.props.stock.symbol,
            "quantity": this.state.quantity_selected
        }
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", "Token "+ this.props.key);
        request.send(JSON.stringify(body));

        request.onload = function() {
            if(request.status !== 200){
                alert(request.response);
            }
            else{
                alert(request.response);
            }
        }
    }

    async quantityChangeHandler(event) {
        await this.setState({quantity_selected: event.target.value});
        //console.log(this.state.quantity_selected);
    }

    populateOptions() {
        const a = Array(10).fill(0);
        return a.map((i, index) => {
            return(
                <option>{index + 1}</option>
            )
        })
    }


    render() {
        return (
            <Form>
                <Form.Row>
                    <Form.Group className="stock-menu-text" as={Col}>{this.props.stock.symbol}</Form.Group>
                    <Form.Group as={Col}>{this.props.stock.price}</Form.Group>
                </Form.Row>

                <Form.Row id="buy-menu">
                    <Form.Group as={Col}>
                        <Form.Control as="select" onChange={this.quantityChangeHandler.bind(this)}>
                            <option>---</option>
                            {this.populateOptions()}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Button id="buy-button" onClick={this.onBuyClick.bind(this)}>Buy</Button>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Col lg="8"><ColoredLine color="black" /></Col>
                </Form.Row>
                
                <div id="query-menu">
                    <Form.Row id="query-menu" className="query-menu">
                        <Form.Label lg="2" column>Symbol:</Form.Label>
                        <Col lg="6">
                            <Form.Control column placeholder="MSFT" />
                        </Col>
                    </Form.Row>

                </div>
                
            </Form>
            
          
        )
    }
}


class StockTable extends React.Component {
    /**
     * Table displaying all stocks the
     * use queried.
     * @param {*} props 
     */
    constructor(props){
        super(props);

        this.state = {
            stocks : [
                createStock("MSFT", "87", 0.05, -2.21, 5.55),
                createStock("TWTR", 9, 0.05, -2.21, 5.55),
                createStock("AAPL", 47, 0.09, -9.23, 8.55)
            ],
            
            clicked_stock : null,

            more_stocks : Array.from({length: 50}, e => createStock("MSFT", "87", 0.05, -2.21, 5.55)),
        }

        const more_stocks = this.state.more_stocks.slice();
        for(let i = 0; i < more_stocks.length; i++){
            more_stocks[i].symbol = i;
        }
        this.setState({more_stocks : more_stocks});
    }


    renderTableData() {
        return this.state.more_stocks.map((stock, index) => {
            const {symbol, price, day, month, year} = stock;
            return (
            <tr key={symbol} onClick={(e) => this.props.clickHandler(stock, e)}>
                    {/* Make onclick() a function a() that updates the ui with symbol as a
                    parameter. a will query for more information using symbol. */}
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
                    <th>Year</th>
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

const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 1
        }}
    />
);

export default Explore;