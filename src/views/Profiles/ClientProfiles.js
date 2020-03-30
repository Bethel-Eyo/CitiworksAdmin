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
import axios from "axios";
import { Pagination } from "@material-ui/lab";
import CardFooter from "components/Card/CardFooter";
import { TextField } from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import Domain from "components/Constants/Keys";

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

export default class ClientProfiles extends React.Component {
  constructor() {
    super();
    this.state = {
      profiles: [],
      message: "",
      itemsCountPerPage: 1,
      totalItemsCount: 1,
      pageRangeDisplayed: 3,
      token: "",
      page: 1,
      pastedID: "",
      activateFindById: false
    };
  }

  componentDidMount() {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get(Domain + "api/admins/user-profiles", {
        headers: headers
      })
      .then(response => {
        this.setState({
          message: "successful",
          profiles: response.data.userprofiles.data,
          rowsPerPage: response.data.userprofiles.per_page,
          totalItemsCount: response.data.userprofiles.last_page
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
        this.setState({
          token: AppState.user_token
        });
        return AppState.user_token;
      }
    }
  };

  setPage(page) {
    return page + 1;
  }

  handleIDChange = name => ({ target: { value } }) => {
    this.setState({
      [name]: value
    });
  };

  findArtisanById = () => {
    // alert(this.state.pastedID);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get(Domain + "api/admins/find-client-by-id/" + this.state.pastedID, {
        headers: headers
      })
      .then(response => {
        this.setState({
          profiles: response.data.profile
        });
      })
      .catch(error => {
        alert("An error occured while finding artisan " + error.message);
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
      .get(Domain + "api/admins/user-profiles?page=" + value, {
        headers: headers
      })
      .then(response => {
        this.setState({
          profiles: response.data.userprofiles.data,
          itemsCountPerPage: response.data.userprofiles.per_page,
          totalItemsCount: response.data.userprofiles.last_page,
          page: response.data.userprofiles.current_page
        });
      });
  }

  classes = () => {
    return useStyles();
  };

  render() {
    const { page, pastedID } = this.state;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          {/* <form className={this.classes.form} onSubmit={this.findArtisanById}> */}
          <GridContainer>
            <GridItem xs={12} sm={12} md={2} />
            <GridItem xs={12} sm={12} md={2} />
            <GridItem xs={12} sm={12} md={5}>
              <TextField
                id="pastedID"
                label="Paste Client ID"
                variant="outlined"
                style={{ width: "100%" }}
                onChange={this.handleIDChange("pastedID")}
                value={pastedID}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <Button
                variant="contained"
                color="danger"
                onClick={this.findArtisanById}
                component="span"
              >
                Find Profile by ID
              </Button>
            </GridItem>
          </GridContainer>
          {/* </form> */}
          <Card>
            <CardHeader color="primary">
              <h4 className={this.classes.cardTitleWhite}>
                Client Profiles Table
              </h4>
              <p className={this.classes.cardCategoryWhite}>
                A list of the profiles of all clients
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={[
                  "User id",
                  "Phone Number",
                  "address",
                  "picture-link",
                  "gender"
                ]}
                tableData={this.state.profiles.map((profile, index) => [
                  profile.user_id,
                  profile.phone_number,
                  profile.address,
                  profile.profile_picture,
                  profile.gender
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
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
