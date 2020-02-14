import React from 'react';
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import { links, api_url } from '../router';
import "./authenticationforms.css";
import { request } from 'http';



class SignupPage extends React.Component {
    
    dummySubmit(){
        console.log("dummy submit");
    }

    constructor(props){
        super(props);

        this.signupHandler = this.signupHandler.bind(this);
    }

    signupHandler(event){
        event.preventDefault();
        const user = event.target.elements.username.value;
        const password1 = event.target.elements.password1.value;
        const password2 = event.target.elements.password2.value;

        event.target.elements.password1.value = null;
        event.target.elements.password2.value = null;

        if(password1 !== password2){
            alert("Passwords do not match");  
        }
        else{
            let xhr = new XMLHttpRequest();
            xhr.open("POST", api_url + "create-user/")
            const body = {
                "username" : user,
                "password" : password1
            }
            
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(body));
            
            xhr.onload = () => {
                let response = JSON.parse(xhr.response);
                if(xhr.status === 400){
                    alert("Username is taken");
                }
                else if(xhr.status === 201){
                    event.target.elements.username.value = null;
                    this.props.storeCurrentUser(response.username, response.token);
                    alert(response.username);
                }
                else{
                    alert(response.status + ": Something went wrong");
                }
            }
        }
    }

    render() {
        return(
            <Container className="login-styling">
                <h3>Create account</h3>
                <Form className="justify-content-center" onSubmit={this.signupHandler}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Username:</Form.Label>
                        <Col sm={10}>
                            <Form.Control name="username" required type="text" placeholder="Username"/>
                        </Col>
                        
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label id="password1" column sm={2}>Password:</Form.Label>
                        <Col sm={10}>
                            <Form.Control name="password1" required type="password" placeholder="Password"/>
                        </Col>
                        
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label id="password2" column sm={2}>Password:</Form.Label>
                        <Col sm={10}>
                            <Form.Control name="password2" required type="password" placeholder="Re-enter password"/>
                        </Col>
                        
                    </Form.Group>
                
                    <Form.Group as={Row} className="submission-styling">
                        <Col lg={2}>
                            <Button className="justify-content-center" type="submit">Submit</Button>
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