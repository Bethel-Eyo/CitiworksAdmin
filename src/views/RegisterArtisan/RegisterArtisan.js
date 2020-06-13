import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/Avatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import avatar from "assets/img/faces/marc.jpg";
import CircularIndeterminate from "components/Specials/CircularProgress";
import Domain from "components/Constants/Keys";
import NigerianStates from "components/Constants/NigerianStates";
import { createBrowserHistory } from "history";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

const genders = [
  {
    value: " ",
    label: " "
  },
  {
    value: "Male",
    label: "Male"
  },
  {
    value: "Female",
    label: "Female"
  }
];

const certificates = [
  {
    value: " ",
    label: " "
  },
  {
    value: "primary",
    label: "Primary Education"
  },
  {
    value: "secondary",
    label: "WAEC/GCE/NECO/NABTEB"
  },
  {
    value: "OND",
    label: "OND"
  },
  {
    value: "HND",
    label: "HND"
  },
  {
    value: "Bsc",
    label: "Bsc"
  },
  {
    value: "masters",
    label: "Masters Degree"
  },
  {
    value: "Other",
    label: "Other"
  }
];

const categories = [
  {
    value: " ",
    label: " "
  },
  {
    value: "Carpentry",
    label: "Carpentry"
  },
  {
    value: "Cleaning",
    label: "Cleaning"
  },
  {
    value: "Electrical and Electronics",
    label: "Electrical and Electronics"
  },
  {
    value: "Plumbing",
    label: "Plumbing"
  },
  {
    value: "Painting",
    label: "Painting"
  },
  {
    value: "Masonry",
    label: "Masonry"
  }
];

export default class RegisterArtisan extends React.Component {
  state = {
    artisan: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: ""
    },
    phone_number: "",
    area: "",
    street: "",
    state: "",
    bank_name: "",
    gender: "",
    account_number: "",
    qualification: "",
    cert_file: "",
    profile_picture: "",
    imagePreviewUrl: avatar,
    filePreviewUrl: null,
    artisan_id: "",
    category: "",
    dialog: false,
    messageTitle: "",
    messageBody: "",
    isLoading: false,
    review: false
  };

  handleChange = name => ({ target: { value } }) => {
    this.setState({
      artisan: {
        ...this.state.artisan,
        [name]: value
      }
    });
  };

  handleProfileChange = name => ({ target: { value } }) => {
    this.setState({
      [name]: value
    });
  };

  classes = () => {
    return useStyles();
  };

  fileChangeHandler = event => {
    this.setState({
      profile_picture: event.target.files[0]
    });

    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(event.target.files[0]);
  };

  fileUploadHandler = event => {
    this.setState({
      cert_file: event.target.files[0]
    });

    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        filePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(event.target.files[0]);
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

  registerArtisan = e => {
    // alert(this.state.artisan.state);
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    this.setState({
      isLoading: false
    });
    axios
      .post(Domain + "api/admins/register-artisan", this.state.artisan, {
        headers: headers
      })
      .then(response => {
        // alert(response.data.message);
        let id = response.data.data.id;
        this.setState({
          artisan_id: id
        });
        this.setState({
          messageTitle: "success",
          messageBody: response.data.message
        });
        this.createProfile(headers);
      })
      .catch(error => {
        this.setState({
          messageTitle: "Error",
          messageBody: "An error occured on artisan create " + error.message,
          isLoading: false
        });
        //this.handleClickOpen();
        alert("An error occured on artisan create " + error.message);
      });
  };

  createProfile = headers => {
    const artisanProfile = {
      phone_number: this.state.phone_number,
      area: this.state.area,
      street: this.state.street,
      state: this.state.state,
      bank_name: this.state.bank_name,
      account_number: this.state.account_number,
      qualification: this.state.qualification,
      gender: this.state.gender,
      profile_picture: this.state.imagePreviewUrl,
      cert_file: this.state.filePreviewUrl,
      category: this.state.category
    };
    this.setState({
      isLoading: true
    });
    axios
      .post(
        Domain + "api/admins/create-artisan-profile/" + this.state.artisan_id,
        artisanProfile,
        {
          headers: headers
        }
      )
      .then(response => {
        this.setState({
          messageTitle: "Success",
          messageBody: response.data.message,
          isLoading: false
        });
        this.handleClickOpen();
      })
      .catch(error => {
        this.setState({
          messageTitle: "Error",
          messageBody:
            "An error occured on artisan profile create " + error.message,
          isLoading: false
        });
        this.handleClickOpen();
      });
  };

  handleClickOpen = () => {
    this.setState({
      dialog: true
    });
  };

  handleClose = () => {
    if (this.state.messageTitle == "Success") {
      this.setState({
        dialog: false
      });
      window.location.reload();
    } else {
      this.setState({
        dialog: false
      });
    }
  };

  render() {
    const {
      artisan: { first_name, last_name, email, password, password_confirmation }
    } = this.state;

    const {
      phone_number,
      area,
      street,
      state,
      bank_name,
      account_number,
      qualification,
      gender,
      category,
      dialog
    } = this.state;

    let $filePreview = (
      <div className="previewText image-container">
        Please select the file of the degree or qualification you chose above
      </div>
    );
    if (this.state.filePreviewUrl) {
      $filePreview = (
        <div className="image-container">
          <img src={this.state.filePreviewUrl} alt="icon" width="200" />{" "}
        </div>
      );
    }

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="danger">
                <h4 className={this.classes.cardTitleWhite}>New Artisan</h4>
                <p className={this.classes.cardCategoryWhite}>
                  Complete the following
                </p>
              </CardHeader>
              <form
                className={this.classes.form}
                onSubmit={this.registerArtisan}
              >
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="first_name"
                        label="First Name"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleChange("first_name")}
                        value={first_name}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="last_name"
                        label="Last Name"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleChange("last_name")}
                        value={last_name}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="email_address"
                        label="Email address"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleChange("email")}
                        value={email}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="phone_number"
                        label="Phone number"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleProfileChange("phone_number")}
                        value={phone_number}
                      />
                    </GridItem>
                  </GridContainer>
                  <br />
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        style={{ width: "100%" }}
                        id="select_state"
                        select
                        label="Select State"
                        value={state}
                        onChange={this.handleProfileChange("state")}
                        SelectProps={{
                          native: true
                        }}
                        helperText="Select Country"
                        variant="filled"
                      >
                        {NigerianStates.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="area"
                        label="LGA of residence"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleProfileChange("area")}
                        value={area}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="street"
                        label="Street of residence"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleProfileChange("street")}
                        value={street}
                      />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="bank_name"
                        label="Bank Name"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleProfileChange("bank_name")}
                        value={bank_name}
                      />
                    </GridItem>
                  </GridContainer>
                  <br />
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="account_number"
                        label="Account Number"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleProfileChange("account_number")}
                        value={account_number}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        style={{ width: "100%" }}
                        id="select_certification"
                        select
                        label="Certification/Degree"
                        value={qualification}
                        onChange={this.handleProfileChange("qualification")}
                        SelectProps={{
                          native: true
                        }}
                        helperText="Select Degree/Certification"
                        variant="filled"
                      >
                        {certificates.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        style={{ width: "100%" }}
                        id="filled-select-currency-native"
                        select
                        label="Gender"
                        value={gender}
                        onChange={this.handleProfileChange("gender")}
                        SelectProps={{
                          native: true
                        }}
                        helperText="Select Gender"
                        variant="filled"
                      >
                        {genders.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        style={{ width: "100%" }}
                        onChange={this.handleChange("password")}
                        value={password}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <TextField
                      id="password_confirmation"
                      label="Password"
                      variant="outlined"
                      type="password_confirmation"
                      style={{ width: "100%", marginLeft: 20 }}
                      onChange={this.handleChange("password_confirmation")}
                      value={password_confirmation}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <TextField
                      style={{ width: "100%" }}
                      id="category"
                      select
                      label="Category"
                      value={category}
                      onChange={this.handleProfileChange("category")}
                      SelectProps={{
                        native: true
                      }}
                      helperText="Select Category"
                      variant="filled"
                    >
                      {categories.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <div style={{ marginTop: 60, marginLeft: 30 }}>
                      <input
                        accept="image/*"
                        className={this.classes.input}
                        id="upload-image"
                        multiple
                        type="file"
                        onChange={this.fileChangeHandler}
                      />
                      <label htmlFor="upload-image">
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                        >
                          Upload Image
                        </Button>
                      </label>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CardAvatar profile>
                      <img src={this.state.imagePreviewUrl} alt="..." />
                    </CardAvatar>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <div style={{ marginTop: 60, paddingLeft: 20 }}>
                      <input
                        accept="image/*"
                        className={this.classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={this.fileUploadHandler}
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                        >
                          Upload Qualification
                        </Button>
                      </label>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    {$filePreview}
                  </GridItem>
                </GridContainer>
                <CardFooter>
                  <GridContainer xs={12} sm={12} md={12}>
                    <GridItem xs={12} sm={12} md={7}>
                      <div>
                        <Dialog
                          open={dialog}
                          onClose={this.handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {this.state.messageTitle}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              {this.state.messageBody}
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            {/* <Button onClick={this.handleClose} color="primary">
                              Disagree
                            </Button> */}
                            <Button
                              onClick={this.handleClose}
                              color="primary"
                              autoFocus
                            >
                              Okay
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={2}>
                      {this.state.isLoading ? <CircularIndeterminate /> : null}
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <Button
                        type="submit"
                        color="danger"
                        style={{ marginLeft: 40 }}
                      >
                        Register Artisan
                      </Button>
                    </GridItem>
                  </GridContainer>
                </CardFooter>
              </form>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
