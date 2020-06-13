import React from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Domain from "components/Constants/Keys";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/Avatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from "@material-ui/core/TextField";
import avatar from "assets/img/faces/marc.jpg";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularIndeterminate from "components/Specials/CircularProgress";

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

class RegisterAdmin extends React.Component {
  state = {
    admin: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: ""
    },
    phone_number: "",
    imagePreviewUrl: avatar,
    position: "",
    gender: "",
    adminId: "",
    dialog: false,
    messageTitle: "",
    messageBody: "",
    isLoading: false
  };
  classes = () => {
    return useStyles();
  };

  handleChange = name => ({ target: { value } }) => {
    this.setState({
      admin: {
        ...this.state.admin,
        [name]: value
      }
    });
  };

  handleProfileChange = name => ({ target: { value } }) => {
    this.setState({
      [name]: value
    });
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

  getToken = () => {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      if (AppState.isLoggedIn == true) {
        return AppState.user_token;
      }
    }
  };

  registerAdmin = e => {
    e.preventDefault();
    this.setState({
      isLoading: true
    });
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .post(Domain + "api/register-admin", this.state.admin, {
        headers: headers
      })
      .then(response => {
        let id = response.data.data.id;
        this.setState({
          adminId: id
        });
        this.createProfile(headers);
      })
      .catch(error => {
        this.setState({
          messageTitle: "Error",
          messageBody: "An error occured on artisan create " + error.message,
          isLoading: false
        });
        alert("An error occured on artisan create " + error.message);
      });
  };

  createProfile = headers => {
    const adminProfile = {
      phone_number: this.state.phone_number,
      position: this.state.position,
      profile_picture: this.state.imagePreviewUrl,
      gender: this.state.gender,
      admin_id: this.state.adminId
    };

    axios
      .post(Domain + "api/admins/create-admin-profile", adminProfile, {
        headers: headers
      })
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
      admin: { first_name, last_name, email, password, password_confirmation }
    } = this.state;

    const { phone_number, position, gender, dialog } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={this.classes.cardTitleWhite}>New Admin</h4>
                <p className={this.classes.cardCategoryWhite}>
                  Complete the following
                </p>
              </CardHeader>
              <form className={this.classes.form} onSubmit={this.registerAdmin}>
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
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        style={{ width: "100%" }}
                        onChange={this.handleChange("password")}
                        value={password}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="password_confirmation"
                        label="Password"
                        variant="outlined"
                        type="password_confirmation"
                        style={{ width: "100%" }}
                        onChange={this.handleChange("password_confirmation")}
                        value={password_confirmation}
                      />
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
                        id="position"
                        label="Position"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleProfileChange("position")}
                        value={position}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
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
                    <GridItem xs={12} sm={12} md={3}>
                      {this.state.isLoading ? <CircularIndeterminate /> : null}
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <Button
                        type="submit"
                        color="danger"
                        style={{ marginLeft: 40, marginTop: 100 }}
                      >
                        Create Admin
                      </Button>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </form>
              <CardFooter>
                <GridContainer>
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
                </GridContainer>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default RegisterAdmin;
