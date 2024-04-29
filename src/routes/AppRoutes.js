import { Routes, Route, Link } from "react-router-dom"
import Home from "../component/Home"
import Login from '../component/Login';
import PrivateRoutes from "./PrivateRoutes";
import TableUser from "../component/TableUser";
import Notfound from "./Notfound";
const AppRoutes = () => {
    return (<>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={
                <PrivateRoutes>
                    <TableUser />
                </PrivateRoutes>
            }>
            </Route>
            <Route path="*" element={<Notfound />} />
        </Routes>

    </>);
}

export default AppRoutes;