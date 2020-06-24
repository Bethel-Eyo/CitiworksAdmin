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
import CardFooter from "components/Card/CardFooter";
import { Pagination } from "@material-ui/lab";
import SearchIcon from "@material-ui/icons/Search";
import { TextField } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.js";
import copy from "copy-to-clipboard";
import Domain from "components/Constants/Keys";
import { createBrowserHistory } from "history";

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
  },
  ul: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 0,
    margin: 0,
    listStyle: "none"
  }
};

const useStyles = makeStyles(styles);

export default class Clients extends React.Component {
  constructor() {
    super();
    this.state = {
      clients: [],
      message: "",
      itemsCountPerPage: 1,
      totalItemsCount: 1,
      pageRangeDisplayed: 3,
      token: "",
      page: 1,
      search: "",
      tc: false,
      clientID: "",
      firstName: ""
    };
  }

  componentDidMount() {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get(Domain + "api/admins/users", {
        headers: headers
      })
      .then(response => {
        this.setState({
          message: "successful",
          clients: response.data.users.data,
          rowsPerPage: response.data.users.per_page,
          totalItemsCount: response.data.users.last_page
        });
        console.log(response.users);
      })
      .catch(error => {
        this.setState({ message: error.message });
      });
  }

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

  setPage(page) {
    return page + 1;
  }

  updateSearch = e => {
    this.setState({
      search: e.target.value.substr(0, 20)
    });
  };

  handleChange(event, value) {
    this.setPage(value);
    // alert(value);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.state.token
    };
    console.log(`active page is ${value}`);
    // this.setState({ activePage: page });
    axios
      .get(Domain + "api/admins/users?page=" + value, {
        headers: headers
      })
      .then(response => {
        this.setState({
          clients: response.data.users.data,
          itemsCountPerPage: response.data.users.per_page,
          totalItemsCount: response.data.users.last_page,
          page: response.data.users.current_page
        });
      });
  }

  showNotification = place => {
    switch (place) {
      case "tc":
        if (!this.state.tc) {
          this.setState({
            tc: true
          });
          setTimeout(() => {
            this.setState({
              tc: false
            });
          }, 6000);
        }
        break;
      default:
        break;
    }
  };

  copyClientID = (id, name) => {
    this.setState({
      clientID: id,
      firstName: name
    });
    copy(id);
    this.showNotification("tc");
  };

  classes = () => {
    return useStyles();
  };

  render() {
    const { page, tc } = this.state;
    let filteredClients = this.state.clients.filter(client => {
      return (
        client.first_name
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1
      );
    });
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4} />
            <GridItem xs={12} sm={12} md={4} />
            <GridItem xs={12} sm={12} md={4}>
              <TextField
                id="search"
                label="Search"
                variant="outlined"
                // style={{ width: "100%" }}
                onChange={this.updateSearch}
                value={this.state.search}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <Card>
              <CardHeader color="primary">
                <h4 className={this.classes.cardTitleWhite}>Clients Table</h4>
                <p className={this.classes.cardCategoryWhite}>
                  This a list of all the clients in Citiworks{" "}
                  {this.state.message}
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
                  tableData={filteredClients.map((client, index) => [
                    client.id,
                    client.first_name + " " + client.last_name,
                    client.email,
                    client.created_at,
                    <Button
                      color="primary"
                      onClick={() =>
                        this.copyClientID(client.id, client.first_name)
                      }
                    >
                      Copy ID
                    </Button>
                  ])}
                />
              </CardBody>
              <CardFooter>
                <div className={this.classes.root}>
                  <Pagination
                    page={page}
                    itemsCountPerPage={this.state.itemsCountPerPage}
                    count={this.state.totalItemsCount}
                    pageRangeDisplayed={this.state.pageRangeDisplayed}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>
                {/* {PaginationControlled()} */}
              </CardFooter>
              <Snackbar
                place="tc"
                color="rose"
                icon={AddAlert}
                message={
                  "You have Successfully copied " +
                  this.state.firstName +
                  "'s id: " +
                  this.state.clientID +
                  " to your clipboard"
                }
                open={tc}
                closeNotification={() => {
                  this.setState({
                    tc: false
                  });
                }}
                close
              />
            </Card>
          </GridContainer>
        </GridItem>
      </GridContainer>
    );
  }
}
