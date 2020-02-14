import React from 'react';
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import {links} from '../router.js';
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
        this.props.storeCurrentUser(null, null);
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
                            <Form.Control name="password" required type="text" placeholder="example@example.com"/>
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