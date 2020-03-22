import React from "react";
import Layout from "./components/Layout";
import AppMap from "./components/Map";

const routes = [
  {
    path: "/",
    exact: true,
    text: "Map",
    main: AppMap
  },
  {
    path: "/new",
    text: "New!",
    main: () => <h2>New!</h2>
  }
];

class App extends React.Component {
  render() {
    return <Layout routes={routes} />;
  }
}
export default App;
