import React from 'react';
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import { links } from '../router';
import "./authenticationforms.css";

class SignupPage extends React.Component {
    
    dummySubmit(){
        console.log("dummy submit");
    }

    render() {
        return(
            <Container className="login-styling">
                <h3>Create account</h3>
                <Form className="justify-content-center">
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Username:</Form.Label>
                        <Col sm={10}>
                            <Form.Control required type="text" placeholder="Username"/>
                        </Col>
                        
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label id="password1" column sm={2}>Password:</Form.Label>
                        <Col sm={10}>
                            <Form.Control required type="text" placeholder="example@example.com"/>
                        </Col>
                        
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label id="password2" column sm={2}>Password:</Form.Label>
                        <Col sm={10}>
                            <Form.Control required type="text" placeholder="example@example.com"/>
                        </Col>
                        
                    </Form.Group>
                
                    <Form.Group as={Row} className="submission-styling">
                        <Col lg={2}>
                            <Button className="justify-content-center" onClick={this.dummySubmit}>Submit</Button>
                        </Col>
                        
                        <Col>
                            <NavLink  to={links.login} className="nav-link sign-up" >Already have an account?</NavLink>
                        </Col>
                    </Form.Group>
                   
                    
                </Form>
            </Container>
            
        )
    }
}

export default SignupPage;