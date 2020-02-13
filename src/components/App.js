import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Route, NavLink, Switch} from 'react-router-dom';
import Portfolio from './portfolio.js';
import Explore from './explore.js';
import Login from './login.js';

const links = {
    explore : '/explore',
    portfolio : '/portfolio'
}


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
                    <NavDropdown.Item>Option1</NavDropdown.Item>
                    <NavDropdown.Item>Option2</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>Sign Out</NavDropdown.Item>
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

        }
    }

    render() {
        return(
            <>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <NavLink className="navbar-brand" to="/">Website Title</NavLink>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <NavLink className="nav-link" to={links.portfolio}>Portfolio</NavLink>
                            <NavLink className="nav-link" to={links.explore}>Explore</NavLink>
                        </Nav>
                        <AccountMenu user={this.props.user} imagesrc={"./logo192.png"}/>
                    </Navbar.Collapse>
                    
                </Navbar>
            </>
        )
    }
    
}

class LoggedInView extends React.Component {
    render(){
        return(
            <>
                <Navigation user={this.props.user}/>
                <Switch>
                    <Route path={links.portfolio} component={Portfolio} />
                    <Route path={links.explore} component={Explore} />
                </Switch>
            </>
        )
    }
}

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            key : null,
            user : "test-user"
        }
    }

    render() {
        return(
            <>{this.state.key ? <LoggedInView user={this.state.user} />: <Login />}</>
        )
    }
}

export default App;