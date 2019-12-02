import React, { useState } from "react";
import _ from 'lodash';
import axios from 'axios';
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";

const NavBar = () => {

    const [showResult, setShowResult] = useState(false);
    const [apiMessage, setApiMessage] = useState('');

    const { isAuthenticated, loginWithRedirect, logout, user, getIdTokenClaims } = useAuth0();

    // call BE with JWT
    const callBackendApi = async () => {

        const token = await getIdTokenClaims();
        console.log(`---------   NavBar - callBackendEndpoint - token   -------------`);
        console.log(JSON.stringify(token, null, 4));


        // const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/users/${userId}`;

        // const url = `http://localhost:3001/public`;
        const url = `http://localhost:3001/api/v1/users`;

        const options = {
            url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.__raw
            },
            // data: requestBody,
            timeout: 5000,
            // auth: {
            //     username: environment.username,
            //     password: environment.password
            // }
        };

        console.log(`URL = ${url}`);
        // console.log(`userId = ${userId}`);


        const res = await axios(options).catch((err) => {
            console.log(`-------------  AXIOS ERROR  ---------------`);
            console.log(err);
            console.log(JSON.stringify(err, null, 4));
            console.log(`-------------  ERROR RESPONSE  ---------------`);
            console.log(err.response);

            const errorMessage = _.get(err, 'response.data.message') || _.get(err, 'message');

            setShowResult(true);
            setApiMessage(errorMessage);
        });

        if (res) {
            console.log(`-------------  res.data  ---------------`);
            console.log(JSON.stringify(res.data, null, 4));

            setShowResult(true);
            setApiMessage(res.data);
        }
    };

    return (
        <div>
            {!isAuthenticated && (
                <button onClick={() => loginWithRedirect({})}>Log in</button>
            )}

            {isAuthenticated && (
                <>
                    <button onClick={() => logout()}>Log out</button>

                    <h1>NavBar</h1>
                    <button onClick={callBackendApi}>Call Backend API</button>
                    {showResult && <div>{JSON.stringify(apiMessage, null, 4)}</div>}
                </>
            )}

            {isAuthenticated && (
                <div>
                    <Link to="/">Home</Link>&nbsp;
                    <Link to="/profile">Profile</Link>&nbsp;
                    <Link to="/external-api">External API</Link>
                </div>
            )}
        </div>
    );
};

export default NavBar;
