import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

function infoCard(props) {
  const { objInfo, classes } = props;
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Vor- & Nachname
        </Typography>
        <Typography variant="h6" component="h2">
          {objInfo.username}
        </Typography>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          E-Mail
        </Typography>
        <Typography variant="h6" component="h2">
          {objInfo.email}
        </Typography>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Telefnnumer
        </Typography>
        <Typography variant="h5" component="h2">
          {objInfo.phonenumber}
        </Typography>

        <Typography className={classes.pos} color="textSecondary">
          Personenbeschreibung
        </Typography>
        <Typography variant="body2" component="p">
          {objInfo.text}
        </Typography>

        <Typography className={classes.pos} color="textSecondary">
          Kompetentzen
        </Typography>
        <Typography variant="body2" component="p">
          {objInfo.competencies.map(elem => `- ${elem} `)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default withStyles(styles)(infoCard);
