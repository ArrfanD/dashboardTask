import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";

import { Outlet, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
let LoadingFallback = lazy(() => import("./LoadingFallback"));

const Dashboard = () => {
    let navigate = useNavigate()
    return (
        <div className="h-100 bg-body bg-gradient container-fluid flex-column justify-content-center align-items-center align-items-sm-center align-items-lg-center">
            <Row className="h-100 d-flex md-container lg-container flex-sm-column flex-xs-column flex-md-row flex-lg-row justify-content-evenly">
                <Col className="bg-dark d-flex flex-column align-items-center  col-md-3 col-sm-12 col-12 col-lg-2 py-4 mh-100">
                    <motion.p whileTap={{
                        scale: 1.4,
                        transition: { duration: 0.2 }
                    }} className=" my-4 text-center text-white h5 fs-5 font-weight-bold" onClick={() => navigate('/')}>IMAGE GRID</motion.p>
                    <motion.p whileTap={{
                        scale: 1.4,
                        transition: { duration: 0.2 }
                    }} className=" my-4 text-center text-white h5 fs-5 font-weight-bold" onClick={() => navigate('checktree')}>CHECKBOX SELECTOR</motion.p>
                                        <motion.p whileTap={{
                        scale: 1.4,
                        transition: { duration: 0.2 }
                    }} className=" my-4 text-center text-white h5 fs-5 font-weight-bold" onClick={() => navigate('recorder')}>RECORDER</motion.p>
                </Col>
                <Col className="col-md-9 d-flex flex-column align-items-center h-100 col-sm-12 col-12 col-lg-10">
                    <p className="my-5 h-100 text-muted display-4 text-center">
                        Welcome to the Dashboard Section
                    </p>
                    <Suspense fallback={<LoadingFallback />}>
                        <Outlet />
                    </Suspense>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
