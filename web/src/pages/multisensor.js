import React, { useState, useEffect } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Constants from '../constants';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loading'

export default function Multisensor() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);
    const [originalData, setOriData] = useState([]);
    const [refreshCounter, setCounter] = useState(30);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const filtered = originalData.filter(d => {
            return d.imei.includes(e.target.value)
                || d.id.toString().includes(e.target.value)
                || d.rssi.toString().includes(e.target.value)
                || d.dummy.toString().includes(e.target.value)
                || d.voltage.toString().includes(e.target.value)
                || d.signal.toString().includes(e.target.value)
                || d.sensor1.toString().includes(e.target.value)
                || d.sensor2.toString().includes(e.target.value)
                || d.sensor3.toString().includes(e.target.value)
                || d.sensor4.toString().includes(e.target.value)
                || d.receiver_time.toString().includes(e.target.value)
                ;
        });
        setData(filtered);
    };

    useEffect(() => {
        let counter = refreshCounter;
        const loadData = () => {
            setIsLoaded(false);
            fetch(`${Constants.API_URL}/multisensor`)
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
                        setData(result.data);
                        setOriData(result.data);

                    },
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        };

        loadData();

        const timer = setInterval(() => {
            setCounter(counter);
            counter--;
            if (counter < 1) {
                loadData();
                counter = 30;
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };

    }, []);

    return (
        <>
            {!isLoaded && <Loading />}
            {isLoaded && <div>
                <div className='margin_bottom_30'>
                    <h5>MultiSensor Data</h5>
                </div>
                <div className='row margin_bottom_30'>
                    <div className='col col-sm-4'><div className='col col-sm-2 text-start'><a href='/'> <i className='fa-solid fa-home fa-xl text-primary'></i></a></div></div>
                    <div className='col col-sm-4'><input className='form-control' onChange={handleSearch} placeholder="Search anything"></input></div>
                    <div className='col col-sm-4 text-end'>Auto refresh in {refreshCounter}s</div>
                </div>
                <MDBTable small className='table table-hover table-striped'>
                    <MDBTableHead>
                        <tr>
                            <th>ID</th>
                            <th>IMEI</th>
                            <th>RSSI</th>
                            <th>Dummy</th>
                            <th>Voltage</th>
                            <th>Signal</th>
                            <th>Sensor1</th>
                            <th>Sensor2</th>
                            <th>Sensor3</th>
                            <th>Sensor4</th>
                            <th>Received time</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {
                            data.map(d =>
                                <tr>
                                    <td>{d.id}</td>
                                    <td>{d.imei}</td>
                                    <td>{d.rssi}</td>
                                    <td>{d.dummy}</td>
                                    <td>{d.voltage}</td>
                                    <td>{d.signal}</td>
                                    <td>{d.sensor1}</td>
                                    <td>{d.sensor2}</td>
                                    <td>{d.sensor3}</td>
                                    <td>{d.sensor4}</td>
                                    <td>{d.receiver_time}</td>
                                </tr>
                            )
                        }
                    </MDBTableBody>
                </MDBTable>
            </div>
            }

        </>
    );
}