import React from "react";
import Layout from "./components/Layout";
import AppMap from "./components/Map";
import JobForm from "./components/JobForm";
import WorkerForm from "./components/WorkerForm";

const routes = [
  {
    path: "/",
    exact: true,
    text: "Map",
    main: AppMap
  },
  {
    path: "/new-job",
    text: "New Job",
    main: JobForm
  },
  {
    path: "/new-worker",
    text: "New Worker",
    main: WorkerForm
  }
];

class App extends React.Component {
  render() {
    return <Layout routes={routes} />;
  }
}
export default App;
