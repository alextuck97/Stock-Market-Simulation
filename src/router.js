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


function checkAuthorization(token){
    /**
     * Ping the server with the user's token.
     * The server will tell if it is valid or not.
     */
    let xhr = new XMLHttpRequest();
    xhr.open("GET", api_url + "whoisthis/");

    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.send();

    xhr.onload = () => {
        let response = JSON.parse(xhr.response);
        if(xhr.status === 401){
            //unauthorized
        }
        else if(xhr.status === 200){
            //authorized
            // set state somewhere?
        }
        else{
            alert(response);
        }
    }
}


const PrivateRoute = ({component: Component, }) =>(

    <Route render={props => isAuthorized ? (<Component {...props}/>) : 
        (<Redirect to={{pathname : "/"}}/>)}
    />

);

export {links, Router, api_url};
