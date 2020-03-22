import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

export default class JobForm extends React.Component {
  constructor(props) {
    super(props);

    this.classes = makeStyles(theme => ({
      root: {
        "& > *": {
          margin: theme.spacing(1),
          width: 200
        },
        flexGrow: 1
      }
    }));

    this.state = {
      companyName: "",
      email: "",
      phoneNumber: "",
      location: "",
      jobDescription: "",
      skills: "",
      workingDays: "",
      workingtime: "",
      hourlyRate: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    fetch("http://localhost:5000/register", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.name,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => {
        if (response.status === 200) {
          this.props.history.push("/login");
        }
        // TODO else show alert
      })
      .catch(error => {
        console.log(error);
      });
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    // console.log("change", event);
  }

  render() {
    return (
      <div className={this.classes.root}>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs>
              <TextField
                type="name"
                name="companyName"
                label="Unternehmensname"
                value={this.state.companyName}
                onChange={this.handleChange}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <TextField
                type="email"
                name="email"
                label="Email"
                value={this.state.email}
                onChange={this.handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <TextField
                type="tel"
                name="phoneNumber"
                label="Telefonnummer"
                value={this.state.phoneNumber}
                onChange={this.handleChange}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <TextField
                type="text"
                name="location"
                label="Standort"
                value={this.state.location}
                onChange={this.handleChange}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <TextField
                type="number"
                pattern="^\d+(\.|\,)\d{2}$"
                name="hourlyRate"
                label="Stundenlohn"
                value={this.state.hourlyRate}
                onChange={this.handleChange}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}
