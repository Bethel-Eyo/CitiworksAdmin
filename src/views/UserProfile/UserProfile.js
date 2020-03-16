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
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import axios from "axios";
import TextField from "@material-ui/core/TextField";

import avatar from "assets/img/faces/marc.jpg";

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

export default class UserProfile extends React.Component {
  state = {
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    gender: "",
    phone_number: "",
    id: ""
  };

  componentWillMount() {
    this.getAdmin();
  }

  handleChange = name => ({ target: { value } }) => {
    this.setState({
      [name]: value
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

  getToken = () => {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      if (AppState.isLoggedIn == true) {
        return AppState.user_token;
      }
    }
  };

  // http://bit.ly/2WjUOvx

  getAdmin = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get("http://citiworksapi.test/api/admins/admin-profile", {
        headers: headers
      })
      .then(response => {
        this.setState({
          first_name: response.data[0].admin.first_name,
          last_name: response.data[0].admin.last_name,
          email: response.data[0].admin.email,
          position: response.data[0].position,
          phone_number: response.data[0].phone_number,
          gender: response.data[0].gender,
          id: response.data[0].admin_id
        });
      });
  };

  onUpdateAdmin = () => {
    let first_name = this.state.first_name;
    let last_name = this.state.last_name;
    let email = this.state.email;
    alert("i got in");
    axios
      .post(
        "http://citiworksapi.test/api/admins/update-admin/" + this.state.id,
        { first_name, last_name, email }
      )
      .then(response => {
        alert(response.data.message);
        this.updateAdminProfile();
      })
      .catch(error => {
        alert("An error updating admin's table " + error.message);
      });
  };

  updateAdminProfile = () => {
    let position = this.state.position;
    let phone_number = this.state.phone_number;
    let gender = this.state.gender;
    axios
      .post(
        "http://citiworksapi.test/api/admins/update-admin-profile/" +
          this.state.id,
        { position, phone_number, gender }
      )
      .then(response => {
        alert(response.data.message);
      })
      .catch(error => {
        alert("An error updating admin's profile table " + error.message);
      });
  };

  render() {
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={this.classes.cardTitleWhite}>Edit Profile</h4>
                <p className={this.classes.cardCategoryWhite}>
                  Complete your profile
                </p>
              </CardHeader>
              <CardBody>
                <form
                  className={this.classes.form}
                  onSubmit={this.onUpdateAdmin}
                >
                  {/* <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <CustomInput
                      labelText="Company (disabled)"
                      id="company-disabled"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer> */}
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <TextField
                        id="first_name"
                        label="First Name"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleChange("first_name")}
                        value={this.state.first_name}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <TextField
                        id="last_name"
                        label="Last Name"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleChange("last_name")}
                        value={this.state.last_name}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <TextField
                        style={{ width: "100%" }}
                        id="filled-select-currency-native"
                        select
                        label="Gender"
                        value={this.state.gender}
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
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <TextField
                        id="email_address"
                        label="Email address"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleChange("email")}
                        value={this.state.email}
                        inputProps={{
                          disabled: true
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <TextField
                        id="phone_number"
                        label="Phone number"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleProfileChange("phone_number")}
                        value={this.state.phone_number}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <TextField
                        id="position"
                        label="Position"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleProfileChange("position")}
                        value={this.state.position}
                      />
                    </GridItem>
                  </GridContainer>
                  {/* <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <InputLabel style={{ color: "#AAAAAA" }}>
                      About me
                    </InputLabel>
                    <CustomInput
                      labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                      id="about-me"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 5
                      }}
                    />
                  </GridItem>
                </GridContainer> */}
                </form>
              </CardBody>
              <CardFooter>
                <Button type="submit" color="primary">
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={avatar} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h6 className={this.classes.cardCategory}>
                  {this.state.position}
                </h6>
                <h4 className={this.classes.cardTitle}>
                  {this.state.first_name + " " + this.state.last_name}
                </h4>
                <p className={this.classes.description}>
                  {/* Don{"'"}t be scared of the truth because we need to restart the
                  human foundation in truth And I love you like Kanye loves Kanye
                  I love Rick Owens’ bed design but the back is... */}
                </p>
                <Button color="primary" round>
                  Follow
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
