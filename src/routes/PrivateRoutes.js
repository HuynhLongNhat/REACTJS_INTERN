import { useContext, useState } from "react";
import { Routes, Route, Link } from "react-router-dom"
import { UserContext } from "../component/UserContext";
import Alert from 'react-bootstrap/Alert';
const PrivateRoutes = (props) => {

    const { user } = useContext(UserContext);
    const [show, setShow] = useState(true);
    if (user && !user.auth) {
        return <>
            <Alert variant="danger" className="mt-3">
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                    You don't have permission to access this route
                </p>
            </Alert>
        </>
    }
    return (<>
        {props.children}
    </>);
}

export default PrivateRoutes;