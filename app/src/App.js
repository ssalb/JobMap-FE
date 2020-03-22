import React from "react";
import Layout from "./components/Layout";
import AppMap from "./components/Map";
import JobForm from "./components/JobForm";

const routes = [
  {
    path: "/",
    exact: true,
    text: "Map",
    main: AppMap
  },
  {
    path: "/new-job",
    text: "New job",
    main: JobForm
  }
];

class App extends React.Component {
  render() {
    return <Layout routes={routes} />;
  }
}
export default App;
