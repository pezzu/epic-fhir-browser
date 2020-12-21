import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Layout from "./components/Layout";
import PatientSearch from "./components/PatientSearch";
import PatientDetails from "./components/PatientDetails";

const App = () => {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path="/:patient">
            <PatientDetails />
          </Route>
          <Route exact path="/">
            <PatientSearch />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
};

export default App;
