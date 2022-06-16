// @ts-nocheck
import React, { Suspense, useContext } from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';
import Loading from './shared/components/FormElements/Loading/Loading';
import MainNavigation from './shared/components/Navigation/MainNavigation';
// import NewPlace from './places/pages/NewPlace';
// import UpdatePlace from './places/pages/UpdatePlace';
// import UserPlaces from './places/pages/UserPlaces';
// import Auth from './user/pages/Auth';
// import Users from './user/pages/Users';

const NewPlace = React.lazy(() => import('./places/pages/NewPlace') );
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace') );
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces') );
const Auth = React.lazy(() => import('./user/pages/Auth') );
const Users = React.lazy(() =>  import('./user/pages/Users') );

function App() {
  const loginContext = useContext(AuthContext);

  let routing;
  if (loginContext.isLogin) {
    routing = (<Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/places/new" exact>
        <NewPlace />
      </Route>
      <Route path="/places/:place_id" exact>
        <UpdatePlace />
      </Route>
      <Route path="/:user_id/places" exact>
        <UserPlaces />
      </Route>
      <Redirect to="/" />
    </Switch>)
  } else {
    routing = (<Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/:user_id/places" exact>
        <UserPlaces />
      </Route>
      <Route path="/auth" exact>
        <Auth />
      </Route>
      <Redirect to="/auth" />
    </Switch>)
  }

  return (
    <Router>
      <MainNavigation />
      <main>
        <Suspense fallback={<Loading/>}>
          {routing}
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
