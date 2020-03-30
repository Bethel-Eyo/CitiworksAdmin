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

export default class Dashboard extends React.Component {
  state = {
    totalArtisans: 1,
    totalUsers: 1,
    totalJobs: 1,
    token: ""
  };

  componentDidMount() {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get("http://citiworksapi.test/api/admins/total-artisans", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalArtisans: response.data.number
        });
        // alert("number of artisans: " + this.state.totalArtisans);
      });
    axios
      .get("http://citiworksapi.test/api/admins/total-users", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalUsers: response.data.number
        });
      });
    axios
      .get("http://citiworksapi.test/api/admins/total-client-jobs", {
        headers: headers
      })
      .then(response => {
        this.setState({
          totalJobs: response.data.number
        });
      });
  }

  getToken = () => {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      if (AppState.isLoggedIn == true) {
        this.setState({
          token: AppState.user_token
        });
        return AppState.user_token;
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
      </GridContainer>
    );
  }
}
