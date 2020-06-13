import React from "react";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import axios from "axios";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { black } from "color-name";
import Domain from "components/Constants/Keys";
import { createBrowserHistory } from "history";

export default class Dashboard extends React.Component {
  state = {
    totalArtisans: 1,
    totalUsers: 1,
    totalJobs: 1,
    totalCarpenters: 1,
    totalPlumbers: 1,
    totalElectricians: 1,
    totalBricklayers: 1,
    totalCleaners: 1,
    totalPainters: 1,
    token: ""
  };

  componentDidMount() {
    this.getAllTotals();
  }

  getAllTotals = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get(Domain + "api/admins/total-artisans", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalArtisans: response.data.number
        });
        // alert("number of artisans: " + this.state.totalArtisans);
      });
    axios
      .get(Domain + "api/admins/total-users", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalUsers: response.data.number
        });
      });
    axios
      .get(Domain + "api/admins/total-client-jobs", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalJobs: response.data.number
        });
      });
    axios
      .get(Domain + "api/admins/total-carpenters", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalCarpenters: response.data.number
        });
      });
    axios
      .get(Domain + "api/admins/total-cleaners", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalCleaners: response.data.number
        });
      });
    axios
      .get(Domain + "api/admins/total-electricians", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalElectricians: response.data.number
        });
      });
    axios
      .get(Domain + "api/admins/total-plumbers", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalPlumbers: response.data.number
        });
      });
    axios
      .get(Domain + "api/admins/total-painters", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalPainters: response.data.number
        });
      });
    axios
      .get(Domain + "api/admins/total-bricklayers", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalBricklayers: response.data.number
        });
      });
  };

  decodeJwtToken = token => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    //console.log("Jwt Decode" + jsonPayload);
    return JSON.parse(jsonPayload);
  };

  handleLogout = () => {
    let appState = {
      isLoggedIn: false,
      user: {}
    };
    // save app state with user date in local storage
    localStorage["appState"] = JSON.stringify(appState);
    let history = createBrowserHistory();
    history.push("/login");
    window.location.reload();
  };

  getToken = () => {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      if (AppState.isLoggedIn == true) {
        let payload = {};
        payload = this.decodeJwtToken(AppState.user_token);
        if (payload.exp < Date.now() / 1000) {
          console.log("Bethel! the token has expired");
          this.handleLogout();
        } else {
          console.log(
            "The token has not expired yet: " +
              payload.exp +
              " " +
              Date.now() / 1000
          );
          this.setState({
            token: AppState.user_token
          });
          return AppState.user_token;
        }
      }
    }
  };

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p style={styles.cardCategory}>Used Space</p>
              <h3 style={styles.cardTitle}>
                49/50 <small>GB</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div style={styles.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Get more space
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p style={styles.cardCategory}>Number of Jobs done</p>
              <h3 style={styles.cardTitle}>{this.state.totalJobs}</h3>
            </CardHeader>
            <CardFooter stats>
              <div
              // style={styles.stats}
              >
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p style={styles.cardCategory}>Number of Clients</p>
              <h3 style={styles.cardTitle}>{this.state.totalUsers}</h3>
            </CardHeader>
            <CardFooter stats>
              <div style={styles.stats}>
                <LocalOffer />
                Tracked from Github
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p style={styles.cardCategory}>Number of Artisans</p>
              <h3 style={styles.cardTitle}>{this.state.totalArtisans}</h3>
            </CardHeader>
            <CardFooter stats>
              <div style={styles.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p style={styles.cardCategory}>Number of Carpenters</p>
              <h3 style={styles.cardTitle}>{this.state.totalCarpenters}</h3>
            </CardHeader>
            <CardFooter stats>
              <div style={styles.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p style={styles.cardCategory}>Number of Cleaners</p>
              <h3 style={styles.cardTitle}>{this.state.totalCleaners}</h3>
            </CardHeader>
            <CardFooter stats>
              <div style={styles.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p style={styles.cardCategory}>Number of Electricians</p>
              <h3 style={styles.cardTitle}>{this.state.totalElectricians}</h3>
            </CardHeader>
            <CardFooter stats>
              <div style={styles.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p style={styles.cardCategory}>Number of Plumbers</p>
              <h3 style={styles.cardTitle}>{this.state.totalPlumbers}</h3>
            </CardHeader>
            <CardFooter stats>
              <div style={styles.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p style={styles.cardCategory}>Number of Painters</p>
              <h3 style={styles.cardTitle}>{this.state.totalPainters}</h3>
            </CardHeader>
            <CardFooter stats>
              <div style={styles.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p style={styles.cardCategory}>Number of Bricklayers</p>
              <h3 style={styles.cardTitle}>{this.state.totalBricklayers}</h3>
            </CardHeader>
            <CardFooter stats>
              <div style={styles.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
