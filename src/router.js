import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Explore from "./components/explore.js";
import Portfolio from "./components/portfolio.js";
import LoginPage from "./components/login.js";
import SignupPage from "./components/signup.js";

const links = {
    explore : '/explore',
    portfolio : '/portfolio',
    login : '/',
    signup : '/signup'
}

const isAuthorized = true;

//Add signup route
class Router extends React.Component {

    render() {
        return(
            <Switch>
                <PrivateRoute path={links.explore} component={Explore}/>
                <PrivateRoute path={links.portfolio} component={Portfolio}/>
                <Route 
                    path={links.signup} 
                    render={(props) => <SignupPage {...props} 
                    storeCurrentUser={this.props.storeCurrentUser} />}
                />
                <Route 
                    path={links.login} 
                    render={(props) => <LoginPage {...props} 
                    storeCurrentUser={this.props.storeCurrentUser}/>}
                />
                
            </Switch>
        )
    }
    
}


const PrivateRoute = ({component: Component, }) =>(

    <Route render={props => isAuthorized ? (<Component {...props}/>) : 
        (<Redirect to={{pathname : "/"}}/>)}
    />

);

export {links, Router};
