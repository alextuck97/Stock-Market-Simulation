import React from 'react';
import {Route} from 'react-router';
import {BrowserRouter, Link} from 'react-router-dom';
import {Container, Row, Col, Table, Form, Button} from "react-bootstrap";
import App from "..";
import {api_url} from "../router.js";


class Portfolio extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            portfolio : [],
            loaded_stocks : [],
            clicked_stock : null,
        }

        this.requestPortfolio = this.requestPortfolio.bind(this);
        this.loadStocks = this.loadStocks.bind(this);
        this.tableClickHandler = this.tableClickHandler.bind(this);
        this.onUnwatchLoad = this.onUnwatchLoad.bind(this);
    }

    componentDidMount(){
        this.requestPortfolio();
    }
    

    requestPortfolio(){
        let request = new XMLHttpRequest();

        request.open("GET", api_url + "account-summary/");
        
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", "JWT "+ window.sessionStorage.getItem("token"));
        request.send();
        request.onload = function() {
            if(request.status === 200){
                let response = JSON.parse(request.response);
                this.setState({portfolio : response.portfolio});
                this.loadStocks(response.portfolio);
            }
            else{
                alert(request.status);
            }
        }.bind(this);
    }

    loadStocks(portfolio){
        let industry_defaults = JSON.parse(window.sessionStorage.getItem("industry_defaults"));
        if(portfolio){
            portfolio.map((p,index) => {
                this.requestStock(p.symbol);
            })
        }
    }

    requestStock(ticker){
        let request = new XMLHttpRequest();

        request.open("GET", api_url + "scrape-stock-data/" + ticker + "/1d/1d/");
        
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", "JWT "+ window.sessionStorage.getItem("token"));
        request.send();
        
        request.onload = function() {
            
            
            if(request.status === 200){
                let response = JSON.parse(request.response);
                
                response.payload[0].ticker = response.ticker;
                
                this.setState({loaded_stocks : this.state.loaded_stocks.concat(response.payload)});
                
            }
            else{
                //alert("Bad: " + request.response);
                //this.setState({showSuccessAlert : true});
            }
        }.bind(this);
    }

    onUnwatchLoad(ticker){
        let loaded_stocks = this.state.loaded_stocks;

        for(var i = 0; i < loaded_stocks.length; i++){
            if(loaded_stocks[i].ticker === ticker){
                loaded_stocks.splice(i, 1);
                break;
            }
        }
        this.setState({loaded_stocks : loaded_stocks});
    }

    tableClickHandler(stock, e) {
        e.preventDefault();
        const {ticker, Open, High, Low, date} = stock;
        var clicked_stock = {
                                ticker : ticker, 
                                open : Open,
                                high : High,
                                low : Low,
                                date : date
                            };
        this.setState({clicked_stock : clicked_stock});
    }

    render () {
        
        return (
            <Container className="explore-container" fluid>
                <Row className="explore-row" fluid>
                    <Col id="stock-table-column" className="col-lg- stock-table-column">
                        <StockTable stocks={this.state.loaded_stocks} clickHandler={this.tableClickHandler.bind(this)}/>
                    </Col>
                    <Col id="actions-column" className="stock-menu-container col-lg-3">
                        <PortfolioMenu loadStocksHandler={null} onUnwatchLoad={this.onUnwatchLoad} loadStocks={null} stock={this.state.clicked_stock}/>
                    </Col>
                </Row>
            </Container>
            
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
            stocks : null,
            clicked_stock : null,
        }
        
        this.renderTableData = this.renderTableData.bind(this);
    }


    renderTableData() {
        //let loaded_stocks = JSON.parse(window.localStorage.getItem("loaded_stock"));

        if(this.props.stocks){
            
            return this.props.stocks.map((stock, index) => {
                const {ticker, Open, High, Low, date} = stock;
                
                return (
                <tr key={ticker} onClick={(e) => this.props.clickHandler(stock, e)}>
                        {/* Make onclick() a function a() that updates the ui with symbol as a
                        parameter. a will query for more information using symbol. */}
                        <td>{ticker}</td>
                        <td>{Open}</td>
                        <td>{High}</td>
                        <td>{Low}</td>
                        <td>{date}</td>
                    </tr>
                )
    
            })
        }
        return null;
        
    }

    render() {
        return(
            <Table id="stock-table" striped hover>
                <thead id="table-head">
                    <th>Symbol</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Date</th>
                </thead>
                <tbody>
                    {this.renderTableData()}
                </tbody>
            </Table>
        )
    }
}


class PortfolioMenu extends React.Component{

    onUnwatchClick(){
        let request = new XMLHttpRequest();
        request.open("DELETE", api_url + "watch/");
        
        const body = {
            "symbol": this.props.stock.ticker,
            //"quantity": this.state.quantity_selected
        }
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", "JWT "+ window.sessionStorage.getItem("token"));
        request.send(JSON.stringify(body));

        request.onload = function() {
            if(request.status === 200){
                let response = JSON.parse(request.response);
                if(response.alert === "success"){
                    this.props.onUnwatchLoad(response.symbol);
                }
                else{
                    alert("Not watching that one");
                }
            }
        }.bind(this);
    }


    render(){
        const stock = this.props.stock;
        return(
            <Form>
                <Form.Row>
                    <Form.Group className="stock-menu-text" as={Col}>{stock ? stock.ticker : null}</Form.Group>
                    <Form.Group as={Col}>{stock ? stock.high : null}</Form.Group>
                </Form.Row>

                <Form.Row id="watch-menu">
                    <Form.Group as={Col} className="col-lg-9">
                        <Button variant="danger" id="un-watch-button" block onClick={this.onUnwatchClick.bind(this)}>Un-watch</Button>
                    </Form.Group>
                </Form.Row>
            </Form>
        )
    }
}

export default Portfolio;