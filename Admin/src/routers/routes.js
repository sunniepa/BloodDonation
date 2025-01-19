import React, { Suspense, lazy } from "react";
import { Layout } from 'antd';
import { withRouter } from "react-router";
import Footer from '../components/layout/footer/footer';
import Header from '../components/layout/header/header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import NotFound from '../components/notFound/notFound';
import Sidebar from '../components/layout/sidebar/sidebar';
import LoadingScreen from '../components/loading/loadingScreen';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

const { Content } = Layout;

const Login = lazy(() => {
    return Promise.all([
        import('../pages/Login/login'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const AccountManagement = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/accountManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const AccountCreate = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/AccountCreate/accountCreate'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const CategoryList = lazy(() => {
    return Promise.all([
        import('../pages/CategoryList/categoryList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const DashBoard = lazy(() => {
    return Promise.all([
        import('../pages/DashBoard/dashBoard'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Profile = lazy(() => {
    return Promise.all([
        import('../pages/Profile/profile'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ChangePassword = lazy(() => {
    return Promise.all([
        import('../pages/ChangePassword/changePassword'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const Register = lazy(() => {
    return Promise.all([
        import('../pages/Register/register'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const MedicalStaffManagement = lazy(() => {
    return Promise.all([
        import('../pages/MedicalStaffManagement/MedicalStaffManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const HospitalManagement = lazy(() => {
    return Promise.all([
        import('../pages/HospitalManagement/HospitalManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const EventManagement = lazy(() => {
    return Promise.all([
        import('../pages/EventManagement/EventManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const UserManagement = lazy(() => {
    return Promise.all([
        import('../pages/UserManagement/UserManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const DonorProfileManagement = lazy(() => {
    return Promise.all([
        import('../pages/DonorProfileManagement/DonorProfileManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const BloodStorageManagement = lazy(() => {
    return Promise.all([
        import('../pages/BloodStorageManagement/BloodStorageManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const BloodRequestManagement = lazy(() => {
    return Promise.all([
        import('../pages/BloodRequestManagement/BloodRequestManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ReportManagement = lazy(() => {
    return Promise.all([
        import('../pages/ReportManagement/ReportManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const GiftManagement = lazy(() => {
    return Promise.all([
        import('../pages/GiftManagement/GiftManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const EventRegistrationDetails = lazy(() => {
    return Promise.all([
        import('../pages/EventRegistrationDetails/eventRegistrationDetails'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const RouterURL = withRouter(({ location }) => {

    const LoginContainer = () => (
        <div>
            <PublicRoute exact path="/">
                <Suspense fallback={<LoadingScreen />}>
                    <Login />
                </Suspense>
            </PublicRoute>
            <PublicRoute exact path="/login">
                <Login />
            </PublicRoute>
            <PublicRoute exact path="/reset-password/:id">
                <ChangePassword />
            </PublicRoute>
            <PublicRoute exact path="/register">
                <Register />
            </PublicRoute>
        </div>
    )

    const DefaultContainer = () => (
        <PrivateRoute>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout >
                    <Header />
                    <Content style={{ marginLeft: 230, width: 'calc(100% - 230px)', marginTop: 50 }}>
                        <PrivateRoute exact path="/dash-board">
                            <Suspense fallback={<LoadingScreen />}>
                                <DashBoard />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/profile">
                            <Suspense fallback={<LoadingScreen />}>
                                <Profile />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/notfound">
                            <NotFound />
                        </PrivateRoute>

                        <PrivateRoute exact path="/account-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/account-create">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountCreate />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/notfound">
                            <NotFound /></PrivateRoute>
                        <PrivateRoute exact path="/category-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <CategoryList />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/medical-staff-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <MedicalStaffManagement />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/hospital-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <HospitalManagement />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/event-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <EventManagement />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/user-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <UserManagement />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/donor-profile-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <DonorProfileManagement />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/blood-storage-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <BloodStorageManagement />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/blood-request-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <BloodRequestManagement />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/report-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <ReportManagement />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/gift-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <GiftManagement />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/event-registration-details/:eventId">
                            <Suspense fallback={<LoadingScreen />}>
                                <EventRegistrationDetails />
                            </Suspense>
                        </PrivateRoute>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </PrivateRoute >
    )

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/register">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/login">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/reset-password/:id">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/account-create">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/account-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/notification">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/product-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/category-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/profile">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/medical-staff-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/order-details/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/hospital-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/user-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/donor-profile-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/blood-storage-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/blood-request-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/report-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/gift-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-registration-details/:eventId">
                        <DefaultContainer />
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
})

export default RouterURL;
