import React from 'react';
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import {links, api_url} from '../router.js';
import {Redirect} from "react-router-dom";
import "./authenticationforms.css";



class LoginPage extends React.Component {
    // Need a way to navigate between existing account and signup

    //loginHandler = () => {
     //   console.log("form submitted");
    //}

    constructor(props){
        super(props);

        this.loginHandler = this.loginHandler.bind(this);
    }

    loginHandler(event){
        //send a request
        event.preventDefault();
        const user = event.target.elements.username.value;
        const password = event.target.elements.password.value;
        
        event.target.elements.username.value = null;
        event.target.elements.password.value = null;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", api_url + "token-auth/")
        const body = {
            "username" : user,
            "password" : password
        }

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(body));

        xhr.onload = () => {
            if(xhr.status === 400){
                alert("Wrong username or password");
            }
            else if(xhr.status === 200){
                let response = JSON.parse(xhr.response);
                this.props.storeCurrentUser(response.user.username, response.token);
                //alert(response.user.username);
                this.props.history.push(links.explore);
            }
            else{
                alert("Something went wrong");
            }
        }
    }

    render() {
        return(
            <Container className="login-styling">
                <h3>Sign in</h3>
                <Form className="justify-content-center" onSubmit={this.loginHandler}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Username:</Form.Label>
                        <Col sm={10}>
                            <Form.Control name="username" required type="text" placeholder="Username"/>
                        </Col>
                        
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Password:</Form.Label>
                        <Col sm={10}>
                            <Form.Control name="password" type="password" required placeholder="Password"/>
                        </Col>
                        
                    </Form.Group>
                
                    <Form.Group as={Row} className="submission-styling">
                        <Col lg={2}>
                            <Button className="justify-content-center" type="submit">Submit</Button>
                        </Col>
                        <Col lg={3}>
                            <NavLink className="nav-link sign-up" to={links.signup}>Or sign up</NavLink>
                        </Col>
                    </Form.Group>
                   
                    
                </Form>
            </Container>
            
        )
    }
}


export default LoginPage;