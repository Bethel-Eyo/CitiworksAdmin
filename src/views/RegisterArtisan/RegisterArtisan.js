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

const countries = [
  {
    value: " ",
    label: " "
  },
  {
    value: "Nigeria",
    label: "Nigeria"
  },
  {
    value: "other",
    label: "Other"
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

export default class RegisterArtisan extends React.Component {
  state = {
    artisan: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: ""
    },
    artisanProfile: {
      phone_number: "",
      area: "",
      city: "",
      country: "",
      bank_name: "",
      gender: "",
      account_number: "",
      qualification: "",
      cert_file: "",
      profile_picture: ""
    },
    imagePreviewUrl: avatar,
    filePreviewUrl: null,
    artisan_id: ""
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
      artisanProfile: {
        ...this.state.artisanProfile,
        [name]: value
      }
    });
  };

  classes = () => {
    return useStyles();
  };

  fileChangeHandler = event => {
    this.setState({
      artisanProfile: {
        ...this.state.artisanProfile,
        profile_picture: event.target.files[0]
      }
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
      artisanProfile: {
        ...this.state.artisanProfile,
        cert_file: event.target.files[0]
      }
    });

    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        filePreviewUrl: reader.result
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

  registerArtisan = e => {
    e.preventDefault();
    // alert(this.state.artisan.country);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };

    axios
      .post(
        "http://citiworksapi.test/api/admins/register-artisan",
        this.state.artisan,
        {
          headers: headers
        }
      )
      .then(response => {
        alert(response.data.message);
        let id = response.data.data.id;
        this.setState({
          artisan_id: id
        });
        this.createProfile(headers);
      })
      .catch(error => {
        alert("An error occured on artisan create " + error.message);
      });
  };

  createProfile = headers => {
    axios
      .post(
        "http://citiworksapi.test/api/admins/create-artisan-profile/" +
          this.state.artisan_id,
        this.state.artisanProfile,
        {
          headers: headers
        }
      )
      .then(response => {
        alert("id: " + this.state.artisanProfile.artisan_id);
        alert(response.data.message);
      })
      .catch(error => {
        alert("An error occured on artisan profile create " + error.message);
      });
  };

  render() {
    const {
      artisan: { first_name, last_name, email, password, password_confirmation }
    } = this.state;

    const {
      artisanProfile: {
        phone_number,
        area,
        city,
        country,
        bank_name,
        account_number,
        qualification,
        gender
      }
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
                        id="area"
                        label="Area"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleProfileChange("area")}
                        value={area}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        id="city"
                        label="City"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleProfileChange("city")}
                        value={city}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <TextField
                        style={{ width: "100%" }}
                        id="select_country"
                        select
                        label="Country"
                        value={country}
                        onChange={this.handleProfileChange("country")}
                        SelectProps={{
                          native: true
                        }}
                        helperText="Select Country"
                        variant="filled"
                      >
                        {countries.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
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
                      style={{ width: "100%" }}
                      onChange={this.handleChange("password_confirmation")}
                      value={password_confirmation}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
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
                  <GridItem xs={12} sm={12} md={2}>
                    <CardAvatar profile>
                      <img src={this.state.imagePreviewUrl} alt="..." />
                    </CardAvatar>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <div style={{ marginTop: 60 }}>
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
                    <GridItem xs={12} sm={12} md={9}></GridItem>
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
