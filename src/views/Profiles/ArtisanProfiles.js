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
import Button from "components/CustomButtons/Button.js";
import RecipeReviewCard from "components/Card/ComplexCard";
import { Pagination } from "@material-ui/lab";
import CardFooter from "components/Card/CardFooter";
import Domain from "components/Constants/Keys";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import CircularIndeterminate from "components/Specials/CircularProgress";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.js";
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
  }
};

const useStyles = makeStyles(styles);

export default class ArtisanProfiles extends React.Component {
  constructor() {
    super();
    this.state = {
      profiles: [],
      message: "",
      artisan: {},
      expanded: false,
      first_name: "",
      last_name: "",
      address: "",
      bankName: "",
      qualification: "",
      phoneNumber: "",
      gender: "",
      accountNo: "",
      profilePix: "",
      category: "",
      gender: "",
      certificate: "",
      itemsCountPerPage: 1,
      totalItemsCount: 1,
      pageRangeDisplayed: 3,
      token: "",
      page: 1,
      dialog: false,
      isLoading: false,
      tc: false,
      artisanId: ""
    };
  }

  handleProfileChange = name => ({ target: { value } }) => {
    this.setState({
      [name]: value
    });
  };

  handleClose = () => {
    this.setState({
      dialog: false
    });
  };

  componentDidMount() {
    //this.getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get(Domain + "api/admins/artisan-profiles", {
        headers: headers
      })
      .then(response => {
        this.setState({
          message: "successful",
          profiles: response.data.artisanprofiles.data,
          rowsPerPage: response.data.artisanprofiles.per_page,
          totalItemsCount: response.data.artisanprofiles.last_page
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

  getDetails = (profile, type) => {
    // alert(id);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    this.setState({
      address: profile.address,
      bankName: profile.bank_name,
      qualification: profile.qualification,
      phoneNumber: profile.phone_number,
      gender: profile.gender,
      accountNo: profile.account_number,
      profilePix: profile.profile_picture,
      category: profile.category,
      certificate: profile.cert_file,
      artisanId: profile.artisan_id
    });
    axios
      .get(Domain + "api/admins/artisan/" + profile.artisan_id, {
        headers: headers
      })
      .then(response => {
        this.setState({
          artisan: response.data.artisan,
          first_name: response.data.artisan.first_name,
          last_name: response.data.artisan.last_name
        });
        if (type == "edit") {
          this.setState({
            dialog: true
          });
        }
      });
  };

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

  editArtisan = () => {
    this.setState({
      isLoading: true
    });
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    let handyman = {
      id: this.state.artisanId,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      address: this.state.address,
      bank_name: this.state.bankName,
      qualification: this.state.qualification,
      phone_number: this.state.phoneNumber,
      gender: this.state.gender,
      account_number: this.state.accountNo,
      category: this.state.category
    };
    axios
      .post(Domain + "api/admins/edit-artisan", handyman, {
        headers: headers
      })
      .then(response => {
        this.setState({
          isLoading: false
        });
        this.showNotification("tc");
        window.location.reload();
      })
      .catch(error => {
        alert("An error occurred" + error.message);
        this.setState({
          isLoading: false
        });
      });
  };

  setPage(page) {
    return page + 1;
  }

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
      .get(Domain + "api/admins/artisan-profiles?page=" + value, {
        headers: headers
      })
      .then(response => {
        this.setState({
          profiles: response.data.artisanprofiles.data,
          itemsCountPerPage: response.data.artisanprofiles.per_page,
          totalItemsCount: response.data.artisanprofiles.last_page,
          page: response.data.artisanprofiles.current_page
        });
      });
  }

  classes = () => {
    return useStyles();
  };
  render() {
    const {
      page,
      dialog,
      address,
      bankName,
      qualification,
      phoneNumber,
      gender,
      accountNo,
      category,
      first_name,
      last_name,
      tc
    } = this.state;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="danger">
              <h4 className={this.classes.cardTitleWhite}>
                Artisan Profiles Table
              </h4>
              <p className={this.classes.cardCategoryWhite}>
                A list of the profiles of all artisans
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["Artisan id", "address", "Action"]}
                tableData={this.state.profiles.map((profile, index) => [
                  profile.artisan_id,
                  profile.address,
                  <Button
                    color="danger"
                    onClick={() => {
                      this.getDetails(profile, "edit");
                    }}
                  >
                    Edit
                  </Button>,
                  <Button
                    color="rose"
                    onClick={() => this.getDetails(profile, "details")}
                  >
                    View Details
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
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <RecipeReviewCard
            name={
              this.state.artisan.first_name + " " + this.state.artisan.last_name
            }
            createdAt={this.state.artisan.created_at}
            id={this.state.artisan.id}
            email={this.state.artisan.email}
            dp={this.state.profilePix}
            category={this.state.category}
            gender={this.state.gender}
            qualification={this.state.qualification}
            phoneNumber={this.state.phoneNumber}
            accountNumber={this.state.accountNo}
            bankName={this.state.bankName}
            certificate={this.state.certificate}
            address={this.state.address}
          />
        </GridItem>
        <div>
          <Dialog
            open={dialog}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Edit Artisan</DialogTitle>
            <DialogContent>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    label="First name"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.handleProfileChange("first_name")}
                    value={first_name}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    label="Last name"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.handleProfileChange("last_name")}
                    value={last_name}
                  />
                </GridItem>
              </GridContainer>
              <br />
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    label="Address"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.handleProfileChange("address")}
                    value={address}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    label="Category"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.handleProfileChange("category")}
                    value={category}
                  />
                </GridItem>
              </GridContainer>
              <br />
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    label="Gender"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.handleProfileChange("gender")}
                    value={gender}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    label="Account Number"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.handleProfileChange("accountNo")}
                    value={accountNo}
                  />
                </GridItem>
              </GridContainer>
              <br />
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.handleProfileChange("phoneNumber")}
                    value={phoneNumber}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    label="Qualification"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.handleProfileChange("qualification")}
                    value={qualification}
                  />
                </GridItem>
              </GridContainer>
              <br />
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    label="Bank name"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={this.handleProfileChange("bankName")}
                    value={bankName}
                  />
                </GridItem>
              </GridContainer>
            </DialogContent>
            <DialogActions>
              {this.state.isLoading ? <CircularIndeterminate /> : null}
              <Button onClick={this.handleClose} color="rose" autoFocus>
                Cancel
              </Button>
              <Button onClick={this.editArtisan} color="primary" autoFocus>
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Snackbar
          place="tc"
          color="rose"
          icon={AddAlert}
          message={"Artisan profile was updated successfully"}
          open={tc}
          closeNotification={() => {
            this.setState({
              tc: false
            });
          }}
          close
        />
      </GridContainer>
    );
  }
}
