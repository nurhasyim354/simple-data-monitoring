import React, { useState, useEffect } from 'react';
import Constants from '../constants';
import { useNavigate } from 'react-router-dom';
import {
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBBtn,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';

export default function Home() {

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState({
        db: {},
        gateway: {},
        receiver: {}
    });

    useEffect(() => {
        fetch(`${Constants.API_URL}/config`)
        .then(res => {
            if (res.status === 401) {
                navigate('/login');
                return;
            }
            return res.json();
        })
            .then(
                (result) => {
                    setIsLoaded(true);
                    setData(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, []);

    return (
        <>
            <div className='pageTitle'>Cellular Data Receiver</div>
            <div className='margin_bottom_30'>
                <i className='fa-solid fa-check-circle text-success fa-2xl'></i>
            </div>
            <MDBRow>
                <MDBCol size='md'>
                    <MDBCard>
                        <MDBCardHeader>Database</MDBCardHeader>
                        <MDBCardBody>
                            <div className='text-small'>
                                Host: {data.db.host}
                                <br />
                                Port: {data.db.port}
                                <br />
                                Database: {data.db.database}
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol size='md'>
                    <MDBCard>
                        <MDBCardHeader>Receiver</MDBCardHeader>
                        <MDBCardBody>
                            <div className='text-small'>
                                listening on port: {data.receiver.port}
                                <br />
                                <br />
                                <br />
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol size='md'>
                    <MDBCard>
                        <MDBCardHeader>Gateway</MDBCardHeader>
                        <MDBCardBody>
                            <div className='text-small'>
                                {data.gateway.protocol}://{data.gateway.host}:{data.gateway.port}/{data.gateway.path}
                                <br />
                                <br />
                                <br />
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            <div className='pageFooter'>
                <MDBRow>
                    <MDBCol><MDBBtn href='/multisensor'>MultiSensor</MDBBtn></MDBCol>
                    <MDBCol><MDBBtn href='/ota'>OTA</MDBBtn></MDBCol>
                </MDBRow>
            </div>

        </>
    );
}