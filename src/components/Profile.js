import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-spa";

const Profile = () => {
    const { loading, user } = useAuth0();

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <Fragment>
            <img src={user.picture} alt="Profile" />

            <h3>username: {user.name}</h3>
            <h3>email: {user.email}</h3>
            <pre>{JSON.stringify(user, null, 4)}</pre>
        </Fragment>
    );
};

export default Profile;
