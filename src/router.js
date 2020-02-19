import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Explore from "./components/explore.js";
import Portfolio from "./components/portfolio.js";
import LoginPage from "./components/login.js";
import SignupPage from "./components/signup.js";

const api_url = "http://127.0.0.1:8000/api/";

const links = {
    explore : '/explore',
    portfolio : '/portfolio',
    login : '/',
    signup : '/signup'
}

// Use the getCurrentUser route to verify this
const isAuthorized = true;

//Add signup route
class Router extends React.Component {

    render() {
 
        return(
            
            <Switch>
                
                <PrivateRoute path={links.explore} component={Explore} authorized={this.props.authorized}/>
                <PrivateRoute path={links.portfolio} component={Portfolio} authorized={this.props.authorized}/>
                <Route 
                    path={links.signup} 
                    render={(props) => this.props.authorized ? 
                        <Redirect to={links.explore}/> : 
                        <SignupPage {...props} storeCurrentUser={this.props.storeCurrentUser} />}
                />
                <Route 
                    path={links.login} 
                    render={(props) => this.props.authorized ? 
                        <Redirect to={links.explore}/> : 
                        <LoginPage {...props} storeCurrentUser={this.props.storeCurrentUser}/>}
                />
            
                
            </Switch>
        )
    }
    
}

// For login and signup that should not be accessed by an authenticated user
const PublicOnlyRoute = ({component : Component, authorized : authorized, redirect : redirect}) => (
    <Route render={props =>
        authorized ? (<Redirect to={{pathname : redirect}}/>) : (<Component {...props}/>)
    }
    />
);


const PrivateRoute = ({component: Component, authorized : authorized}) =>(
    <Route render={props => 
            authorized ? (<Component {...props}/>) : (<Redirect to={{pathname : "/"}}/>)
        }
    
    />

);

export {links, Router, api_url};
