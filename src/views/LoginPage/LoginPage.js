import React, { Component } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { createBrowserHistory } from "history";
import { TextField } from "@material-ui/core";
import axios from "axios";
import { Route, Redirect } from "react-router-dom";

import styles from "assets/jss/material-dashboard-react/views/loginPage.js";

import image from "assets/img/bg7.jpg";
import Admin from "layouts/Admin";
import Domain from "components/Constants/Keys";

const useStyles = makeStyles(styles);
// function intialize() {}

// const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");

export default class LoginPage extends Component {
  state = {
    auth: {
      email: " ",
      password: " "
    }
  };

  handleLogin = e => {
    e.preventDefault();
    // alert(Domain);
    let history = createBrowserHistory();
    axios
      .post(Domain + "api/admin-login", this.state.auth)
      .then(response => {
        let appState = {
          isLoggedIn: true,
          user_token: response.data.token,
          admin_id: response.data.user.id
        };
        localStorage["appState"] = JSON.stringify(appState);
        // alert(appState.isLoggedIn);
        history.push("/admin/dashboard");
        window.location.reload();
      })
      .catch(error => {
        alert("An error occured! " + error.message);
      });
  };

  handleChange = name => ({ target: { value } }) => {
    this.setState({
      auth: {
        ...this.state.auth,
        [name]: value
      }
    });
  };

  classes = () => {
    return useStyles();
  };
  // const { ...rest } = props;
  render() {
    const {
      auth: { email, password }
    } = this.state;
    return (
      <div>
        <div
        // className={this.classes.pageHeader}
        // style={{
        //   backgroundImage: "url(" + image + ")",
        //   backgroundSize: "cover",
        //   backgroundPosition: "top center"
        // }}
        >
          <div className={this.classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card style={{ marginTop: 100 }}>
                  <form
                    className={this.classes.form}
                    onSubmit={this.handleLogin}
                  >
                    <CardHeader
                      color="rose"
                      className={this.classes.cardHeader}
                    >
                      <h4 style={{ textAlign: "center" }}>Citiworks Admin</h4>
                    </CardHeader>
                    <CardBody>
                      {/* <CustomInput
                        labelText="Email..."
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "email",
                          defaultValue: this.state.email,
                          onChange: this.handleChange,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={this.classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      /> */}
                      <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={this.handleChange("email")}
                        value={email}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <Email className={this.classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      />
                      <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        style={{ width: "100%", marginTop: 20 }}
                        onChange={this.handleChange("password")}
                        value={password}
                        InputProps={{
                          type: "password",
                          endAdornment: (
                            <InputAdornment position="start">
                              <People
                                className={this.classes.inputIconsColor}
                              />
                            </InputAdornment>
                          )
                        }}
                      />
                      {/* <CustomInput
                        labelText="Password"
                        id="pass"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "password",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={this.classes.inputIconsColor}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          ),
                          autoComplete: "off"
                        }}
                      /> */}
                    </CardBody>
                    <CardFooter className={this.classes.cardFooter}>
                      <Button
                        color="rose"
                        type="handlelogin"
                        style={{ marginLeft: "30%" }}
                      >
                        Login
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}
