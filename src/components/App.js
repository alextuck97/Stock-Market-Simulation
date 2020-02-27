import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Route, NavLink, Switch} from 'react-router-dom';
import Portfolio from './portfolio.js';
import Explore from './explore.js';
import LoginPage from './login.js';
import {links, Router, api_url} from "../router.js";



class AccountMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : props.user,
            imagesrc : props.imagesrc,
        }
    }

    render () {
        return(
            <Nav id="account-menu">
                <NavDropdown alignRight title={this.state.user}>
                    <NavDropdown.Item onClick={this.props.removeCurrentUser}>Sign Out</NavDropdown.Item>
                </NavDropdown>
                <img src={this.state.imagesrc} width="40" height="40"/>
            </Nav>
        )
    }
}


class Navigation extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            linksDisabled : true,
        }
    }

    render() {
        return(
            <>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <NavLink className="navbar-brand" to="/">StockWatch</NavLink>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {this.props.linksDisabled ? null : 
                            <NavLink className="nav-link" to={links.portfolio}>Portfolio</NavLink>}
                            {this.props.linksDisabled ? null : 
                            <NavLink className="nav-link" to={links.explore}>Explore</NavLink>}
                        </Nav>
                        {this.props.linksDisabled ? null :
                            <AccountMenu user={this.props.user} 
                                removeCurrentUser={this.props.removeCurrentUser} 
                                imagesrc={"./logo192.png"}
                            />
                        }
                    </Navbar.Collapse>
                    
                </Navbar>
            </>
        )
    }
    
}


class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            user : "test-user",
            authorized : false,
            linksDisabled : true,
        }

        this.storeCurrentUser = this.storeCurrentUser.bind(this);
        this.removeCurrentUser = this.removeCurrentUser.bind(this);
        this.checkAuthorization = this.checkAuthorization.bind(this);
    }

    componentDidMount(){
        if(!this.state.authorized)
            this.checkAuthorization(window.sessionStorage.getItem("token"));
    }

    storeCurrentUser(user, token){
        window.sessionStorage.setItem("token", token)
        this.setState({user:user, linksDisabled: false, authorized : true});
    }

    removeCurrentUser(){
        this.setState({user : null, linksDisabled : true, authorized : false});
        window.sessionStorage.removeItem("token");
        this.props.history.push(links.login);
    }

    checkAuthorization(token) {
        /**
         * Checks the user's authorization. If th
         */
        let xhr = new XMLHttpRequest();
        xhr.open("GET", api_url + "whoisthis/");
    
        xhr.setRequestHeader("Authorization", "JWT " + token);
        xhr.send();
    
        xhr.onload = () => {
            let response = JSON.parse(xhr.response);
            if(xhr.status === 401){
                this.setState({authorized : false, linksDisabled : true, user : null});
                //alert("authorized false");
            }
            else if(xhr.status === 200){
                this.setState({authorized : true, linksDisabled : false, user : response.username});
                //alert("authorized true");
            }
            else{
                this.setState({authorized : false, linksDisabled : true, user : null});
                alert(response);
            }
        }
    }

    render() {
        return(
            <>
            <Navigation user={this.state.user} 
                removeCurrentUser={this.removeCurrentUser} 
                linksDisabled={this.state.linksDisabled}
            />
            <Router storeCurrentUser={this.storeCurrentUser} 
                authorized={this.state.authorized}
            />
            </>
        )
    }
}

export default App;