import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import BugReport from "@material-ui/icons/BugReport";
import Tasks from "components/Tasks/Tasks.js";
import { bugs, website, server } from "variables/general.js";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Button from "components/CustomButtons/Button.js";
import axios from "axios";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

export default class Clients extends React.Component {
  constructor() {
    super();
    this.state = {
      clients: [],
      message: ""
    };
  }

  componentDidMount() {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get("http://citiworksapi.test/api/admins/users", {
        headers: headers
      })
      .then(response => {
        this.setState({
          message: "successful",
          clients: response.data.users
        });
        console.log(response.users);
      })
      .catch(error => {
        this.setState({ message: error.message });
      });
  }

  getToken = () => {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      if (AppState.isLoggedIn == true) {
        return AppState.user_token;
      }
    }
  };

  classes = () => {
    return useStyles();
  };

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={this.classes.cardTitleWhite}>Clients Table</h4>
              <p className={this.classes.cardCategoryWhite}>
                This a list of all the clients in Citiworks {this.state.message}
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={[
                  "client-id",
                  "Name",
                  "Email",
                  "Created at",
                  "Action"
                ]}
                tableData={this.state.clients.map((client, index) => [
                  client.id,
                  client.first_name + " " + client.last_name,
                  client.email,
                  client.created_at,
                  <Button color="primary">Copy ID</Button>
                ])}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

const users = [
  {
    id: "987656790",
    name: "Datoka rice",
    email: "rice@example.com"
  },
  {
    id: "987656790",
    name: "Datoka rice",
    email: "rice@example.com"
  },
  {
    id: "987656790",
    name: "Datoka rice",
    email: "rice@example.com"
  },
  {
    id: "987656790",
    name: "Datoka rice",
    email: "rice@example.com"
  },
  {
    id: "987656790",
    name: "Datoka rice",
    email: "rice@example.com"
  }
];
