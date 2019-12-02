import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-spa";

const ExternalApi = () => {
    const [showResult, setShowResult] = useState(false);
    const [apiMessage, setApiMessage] = useState("");
    const { getIdTokenClaims } = useAuth0();

    const callApi = async () => {
        try {
            const token = await getIdTokenClaims();

            console.log('---------   external-api-using-fetch  TOKEN  ---------');
            console.log(JSON.stringify(token, null, 4));

            // ***  either specify proxy in package.json, or specify FULL URL
            // "proxy": "http://localhost:3001"

            // const response = await fetch("http://localhost:3001/api/external", {
            const response = await fetch("/api/external", {
                headers: {
                    Authorization: `Bearer ${token.__raw}`
                }
            });

            const responseData = await response.json();

            setShowResult(true);
            setApiMessage(responseData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <h1>External API</h1>
            <button onClick={callApi}>Ping API</button>
            {showResult && <code>{JSON.stringify(apiMessage, null, 4)}</code>}
        </>
    );
};

export default ExternalApi;
