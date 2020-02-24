import React from 'react';
import {Table, Container, Row, Col, Button, Form, Alert} from 'react-bootstrap';
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
        this.setReloadStocks = this.setReloadStocks.bind(this);
        this.loadStocks = this.loadStocks.bind(this);
        this.setLoadStocks = this.setLoadStocks.bind(this);
        this.setTableRefresh = this.setTableRefresh.bind(this);
        this.state = {
            clicked_stock : createStock("MSFT", 250, "-0.05", "+2.2", "+4.3"),
            key : null,
            reload_stocks : false,
            refresh_table : false,
            loadStocks : false,
            loaded_stocks : [],
        }
        
    }

    tableClickHandler(stock, e) {
        e.preventDefault();
        const {ticker, open, high, low, date} = stock;
        var clicked_stock = createStock(ticker, open, high, low, date);
        this.setState({clicked_stock : clicked_stock});
    }

    setReloadStocks(yesorno){
        this.setState({reload_stocks : yesorno});
    }

    setLoadStocks(yesorno){
        this.setState({loadStocks : yesorno})
    }

    setTableRefresh(yesorno){
        this.setState({refresh_table : yesorno});
    }

    componentDidMount(){
        window.localStorage.setItem("loaded_stock", null); 
    }

    requestStock(ticker){
        let request = new XMLHttpRequest();

        request.open("GET", url + "scrape-stock-data/" + ticker + "/1d/1d/");
        
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", "JWT "+ window.sessionStorage.getItem("token"));
        request.send();
        
        request.onload = function() {
            
            
            if(request.status === 200){
                let response = JSON.parse(request.response);
                //let loaded_stocks = JSON.parse(window.localStorage.getItem("loaded_stock"));

                //if(loaded_stocks === null){
                //    loaded_stocks = [];
                //}
                response.payload[0].ticker = response.ticker;
                //let stock = response.payload;
                //stock["ticker"] = response.ticker;
                //loaded_stocks.push(response.payload);
                this.setState({loaded_stocks : this.state.loaded_stocks.concat(response.payload)});
                //window.localStorage.setItem("loaded_stock", JSON.stringify(loaded_stocks));
                
            }
            else{
                //alert("Bad: " + request.response);
                //this.setState({showSuccessAlert : true});
            }
        }.bind(this);
    }

    loadStocks(){
        window.localStorage.removeItem("loaded_stock");
        this.setState({loaded_stocks : []});
        let industry_defaults = JSON.parse(window.sessionStorage.getItem("industry_defaults"));
        if(industry_defaults){
            industry_defaults.map((ticker,index) => {
                this.requestStock(ticker);
            })
            // badness hea
            // it does load stuff into local storage
            // but gets stuck in an infinite loop somehow cause
            // the state wont get reset
            //alert("all mapped");
            this.setState({reload_stocks : false});
           
        }
        
    }


    render () {
        
        return (
            <Container className="explore-container" fluid>
                <Row className="explore-row" fluid>
                    <Col id="stock-table-column" className="col-lg- stock-table-column">
                        <StockTable stocks={this.state.loaded_stocks} tableRefresh = {this.setTableRefresh} clickHandler={this.tableClickHandler.bind(this)}/>
                    </Col>
                    <Col id="actions-column" className="stock-menu-container col-lg-3">
                        <StocksMenu loadStocksHandler={this.setLoadStocks} loadStocks={this.loadStocks} stock={this.state.clicked_stock} key={this.state.key}/>
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
            showSuccessAlert : false,
            stock_on_watch_click : null,
            watch_success : false,
        }

        this.industries = {
            ["Technology"] : "technology",
            ["Real Estate"] : "real_estate",
        }

        this.sendWatchRequest = this.sendWatchRequest.bind(this);
        this.setShowSuccessFalse = this.setShowSuccessFalse.bind(this);
        this.getIndustryDefaults = this.getIndustryDefaults.bind(this);
        this.alert_timeout = null;
    }


    async onWatchClick() {
        await this.setState({stock_on_watch_click : this.props.stock.symbol})
        this.sendWatchRequest();
        this.startAlertTimer();
    }

    getIndustryDefaults(event) {
        let request = new XMLHttpRequest();

        let industry = this.industries[event.target.value];
        window.sessionStorage.removeItem("industry_defaults");
        request.open("GET", url + "request-industry/" + industry + "/");
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", "JWT "+ window.sessionStorage.getItem("token"));
        request.send();

        request.onload = function() {
            let response = JSON.parse(request.response);

            if(request.status === 200){
                window.sessionStorage.setItem("industry_defaults", JSON.stringify(response.defaults));
                //alert(JSON.parse(sessionStorage.getItem("industry_defaults")));
                //this.props.loadStocksHandler(true);
                this.props.loadStocks();
            }
            else{
                alert(request.response);
            }
        }.bind(this);

        
    }


    sendWatchRequest() {
        /* 
        Send the request to watch the stock to ther server
        */
        let request = new XMLHttpRequest();

        request.open("POST", url + "watch/");
        const body = {
            "symbol": this.props.stock.symbol,
            //"quantity": this.state.quantity_selected
        }
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", "JWT "+ window.sessionStorage.getItem("token"));
        request.send(JSON.stringify(body));
        
        request.onload = function() {
            
            let response = JSON.parse(request.response);
            if(request.status === 200){
                //alert(request.response); 
                let watch_success = response.alert === "success"; 
                this.setState({showSuccessAlert : true, watch_success : watch_success});
            }
            else{
                alert(request.response);
                //this.setState({showSuccessAlert : true});
            }
        }.bind(this);
    }


    startAlertTimer(){
        if(this.state.showSuccessAlert){
            clearTimeout(this.alert_timeout);
        }

        this.alert_timeout = window.setTimeout(
            this.setShowSuccessFalse, 2000
        );
    }

    setShowSuccessFalse(){
        this.setState({showSuccessAlert : false})
    }

    async quantityChangeHandler(event) {
        await this.setState({quantity_selected: event.target.value});
        //console.log(this.state.quantity_selected);
    }


    onToastClose(){
        this.setState({showSuccessAlert : false});
    }


    render() {
        return (
            <Form>
                <Form.Row>
                    <Form.Group className="stock-menu-text" as={Col}>{this.props.stock.symbol}</Form.Group>
                    <Form.Group as={Col}>{this.props.stock.price}</Form.Group>
                </Form.Row>

                <Form.Row id="watch-menu">
                    <Form.Group as={Col} className="col-lg-9">
                        <Button id="watch-button" block onClick={this.onWatchClick.bind(this)}>Watch</Button>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Col lg="9"><ColoredLine color="black" /></Col>
                </Form.Row>
                
                <div id="query-menu">
                    <Form.Row id="query-menu" className="query-menu">
                        <Form.Label lg="3" column>Symbol:</Form.Label>
                        <Col lg="4">
                            <Form.Control column placeholder="MSFT" />
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Form.Control as="select" onChange={this.getIndustryDefaults} name="industry">
                            <option>Technology</option>
                            <option>Real Estate</option>
                        </Form.Control>
                    </Form.Row>

                </div>
                <Form.Row id="alert-row">
                    {
                        this.state.showSuccessAlert ? 
                        <WatchAlert symbol={this.state.stock_on_watch_click} success={this.state.watch_success}/> : 
                        null
                    }
                </Form.Row>
            </Form>
            
          
        )
    }
}


class WatchAlert extends React.Component {
    /**
     * The alert displayed when a user watches a stock
     */
    render () {
        let variant = this.props.success ? "primary" : "danger";
        let text = this.props.success ? " added to watch list" : " already watched";
        return (
            <Alert variant={variant} dismissible>
                <p>{this.props.symbol + text}</p>
            </Alert>
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
            r : true,
            more_stocks : Array.from({length: 50}, e => createStock("MSFT", "87", 0.05, -2.21, 5.55)),
        }
        
        const more_stocks = this.state.more_stocks.slice();
        for(let i = 0; i < more_stocks.length; i++){
            more_stocks[i].symbol = i;
        }
        this.renderTableData = this.renderTableData.bind(this);
        this.setState({more_stocks : more_stocks});
    }


    

    //componentDidUpdate(prevProps, prevState){
    //    if(this.props.stocks !== null && prevProps.stocks === null){
    //        this.setState({stocks : JSON.parse(window.localStorage.getItem("loaded_stock"))});
    //    }
    //    else if(this.props.stocks === null){
    //        return;
    //    }
     //   else if(this.props.stocks.length > prevProps.stocks.length){
      //     this.setState({stocks : JSON.parse(window.localStorage.getItem("loaded_stock"))});
       // }
   // }

    renderTableData() {
        //let loaded_stocks = JSON.parse(window.localStorage.getItem("loaded_stock"));

        if(this.props.stocks){
            
            return this.props.stocks.map((stock, index) => {
                const {ticker, Open, High, Low, date} = stock;
                
                return (
                <tr key={ticker} onClick={(e) => this.props.clickHandler(stock[0], e)}>
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