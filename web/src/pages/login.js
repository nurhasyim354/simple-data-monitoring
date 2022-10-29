import React, { useState } from 'react';
import {
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBBtn,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({username, password })
    }

    const inputChangeHandler = (setFunction, event) => {
        setFunction(event.target.value)
    }

    return (
        <>
            <MDBRow>
                <MDBCol className="col-sm-4"></MDBCol>
                <MDBCol className="col-sm-4">
                    <MDBCard>
                        <MDBCardHeader className="card-header text-danger text-start">
                            <h5><i className="fa-solid fa-lock "></i>&nbsp; Login</h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="container">
                                <form onSubmit={handleSubmit}>
                                    <MDBRow className='login-row'>
                                        <MDBCol className="col-sm-4"><label>Username</label></MDBCol>
                                        <MDBCol className="col-sm-8"><input type="text" className="form-control" id="username" name="username" onChange={(e) => inputChangeHandler(setUsername, e)} required /></MDBCol>
                                    </MDBRow>
                                    <MDBRow className='login-row'>
                                        <MDBCol className="col-sm-4"><label>Password</label></MDBCol>
                                        <MDBCol className="col-sm-8"><input type="password" className="form-control" id="password" name="password" onChange={(e) => inputChangeHandler(setPassword, e)} required />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBBtn type="submit" className="btn btn-success btn-login" ><i className="fa-solid fa-arrow-right "></i>&nbsp;Login</MDBBtn>
                                </form>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </>

    );
}