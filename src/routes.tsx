import React from "react";
import { Route, Switch } from "react-router-dom";
import About from "./app/about/components";
import Layout from "./app/layout/components";

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" render={() => <div>Home</div>} />
        <Route exact path="/about" component={About} />
      </Switch>
    </Layout>
  );
};

export default Routes;
