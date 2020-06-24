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
import Button from "components/CustomButtons/Button.js";
import { createBrowserHistory } from "history";
import axios from "axios";
import Domain from "components/Constants/Keys";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";

const TestSecret = "sk_test_928b9becbe9fbce5761021a733edbc966cb3fd71";

const PaystackVerifyAccount =
  "https://api.paystack.co/bank/resolve?account_number=";

const PayStackCreateRecipient = "https://api.paystack.co/transferrecipient";

const InitiateTransfer = "https://api.paystack.co/transfer";

const FinalizeTransfer = "https://api.paystack.co/transfer/finalize_transfer";

const useStyles = makeStyles(theme => ({
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
  root: {
    width: "100%"
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

//const useStyles = makeStyles(styles);

export default class Payments extends React.Component {
  constructor() {
    super();
    this.state = {
      paymentRequests: [],
      confirmedPayments: [],
      message: "",
      accountNumber: "",
      bankCode: 1,
      otp: "",
      dialog: false,
      activeStep: 0,
      otp: "",
      artisanId: "",
      disable: true,
      transferCode: "",
      requestId: "",
      status: "Processing...",
      amount: "",
      completed: false,
      finish: true,
      adminId: ""
    };
  }
  classes = () => {
    return useStyles();
  };

  componentDidMount() {
    this.getPendingPaymentRequests();
    this.getConfirmedPayments();
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
        this.setState({
          adminId: AppState.admin_id
        });
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

  // before authorizing payouts! first, you must check if artisan is a recipient
  checkifArtisanIsARecipient = (artisanId, requestId, amount) => {
    // 0 Next
    this.setState({
      dialog: true,
      requestId: requestId,
      amount: amount
    });
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get(Domain + "api/admins/get-transfer-recipient/" + artisanId, {
        headers: headers
      })
      .then(response => {
        if (response.data.account.length == 0) {
          this.checkIfAccountIsVerfied(artisanId);
        } else {
          // move to create transfer recipient
          console.log("artisan is a recipient");
          this.handleNext();
          this.initiateTransfer(
            response.data.account[0].recipient_code,
            artisanId
          );
        }
      })
      .catch(error => {
        this.setState({ message: error.message });
      });
  };

  //if artisan is not a recipient, then check if artisan has a verified bank account
  checkIfAccountIsVerfied = artisanId => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };

    axios
      .get(Domain + "api/admins/get-verified-account/" + artisanId, {
        headers: headers
      })
      .then(response => {
        if (response.data.account.length == 0) {
          console.log("account has not been verified");
          this.getArtisanAccountNumber(artisanId);
        } else {
          // move to transfer recipient
          this.handleNext();
          this.createTransferRecipient(
            response.data.artisan[0].account_number,
            response.data.account[0].account_name,
            response.data.account[0].bank_code,
            response.data.account[0].artisan_id
          );
          console.log("account is verified");
        }
      })
      .catch(error => {
        this.setState({ message: error.message });
      });
  };

  // if artisan does not have a verified account, then get artisan's account number
  getArtisanAccountNumber = artisanId => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };

    axios
      .get(Domain + "api/admins/artisan-profile/" + artisanId, {
        headers: headers
      })
      .then(response => {
        this.setState({
          accountNumber: response.data.profile[0].account_number,
          bankCode: this.checkBankCodes(response.data.profile[0].bank_name)
        });
        console.log(response.data.profile[0].bank_name);
        this.verifyAccount(
          this.state.accountNumber,
          this.state.bankCode,
          artisanId
        );
      })
      .catch(error => {
        this.setState({ message: error.message });
      });
  };

  verifyAccount = (accountNumber, bankCode, artisanId) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TestSecret
    };

    //console.log(bankCode);

    axios
      .get(PaystackVerifyAccount + accountNumber + "&bank_code=" + bankCode, {
        headers: headers
      })
      .then(response => {
        if (response.data.status == true) {
          this.setState({
            message: response.data.message
          });
          this.createVerifiedAccount(
            accountNumber,
            response.data.data.account_name,
            bankCode,
            artisanId
          );
        }
      });
  };

  createVerifiedAccount = (accountNumber, accountName, bankCode, artisanId) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };

    let details = {
      artisan_id: artisanId,
      account_name: accountName,
      account_number: accountNumber,
      bank_code: bankCode
    };

    axios
      .post(Domain + "api/admins/create-verified-account", details, {
        headers: headers
      })
      .then(response => {
        this.setState({ message: "Verification account created successfully" });
        // 2 Next
        this.handleNext();
        this.createTransferRecipient(
          accountNumber,
          accountName,
          bankCode,
          artisanId
        );
      })
      .catch(error => {
        this.setState({ message: error.message });
      });
  };

  createTransferRecipient = (
    accountNumber,
    accountName,
    bankCode,
    artisanId
  ) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TestSecret
    };

    let recipient = {
      account_number: accountNumber,
      name: accountName,
      type: "nuban",
      bank_code: bankCode,
      currency: "NGN"
    };

    axios
      .post(PayStackCreateRecipient, recipient, {
        headers: headers
      })
      .then(response => {
        this.saveTransferRecipient(
          artisanId,
          response.data.data.recipient_code
        );
      })
      .catch(error => {
        this.setState({ message: error.message });
      });
  };

  saveTransferRecipient = (artisanId, recipientCode) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };

    let recipient = {
      artisan_id: artisanId,
      recipient_code: recipientCode
    };

    axios
      .post(Domain + "api/admins/create-transfer-recipient", recipient, {
        headers: headers
      })
      .then(response => {
        this.setState({ message: "recipient has been saved successfully" });
        // move to transfer recipient
        //this.handleNext();
        this.initiateTransfer(recipientCode, artisanId);
      })
      .catch(error => {
        this.setState({ message: error.message });
      });
  };

  initiateTransfer = (recipientCode, artisanId) => {
    // move to initiate transfer
    this.handleNext();
    //alert("artisanId: " + artisanId);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TestSecret
    };

    let transfer = {
      source: "balance",
      amount: this.state.amount,
      recipient: recipientCode,
      reason: "Artisan cashout"
    };

    axios
      .post(InitiateTransfer, transfer, {
        headers: headers
      })
      .then(response => {
        if (response.data.data.status == "otp") {
          this.setState({
            message: "Please enter OTP to continue",
            transferCode: response.data.data.transfer_code
          });
          // move to finalize transfer
          this.handleNext();
          this.setState({
            artisanId: artisanId,
            disable: false
          });
        } else {
          alert("Something went wrong at initiate transfer");
        }
      });
  };

  finalizeTransfer = otp => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TestSecret
    };

    let finalize = {
      transfer_code: this.state.transferCode,
      otp: otp
    };

    axios
      .post(FinalizeTransfer, finalize, {
        headers: headers
      })
      .then(response => {
        if (response.data.status == true) {
          if (response.data.data.status == "success") {
            alert("Transfer has been completed successfully");
            this.updateRequestTable(this.state.requestId);
          }
        }
      });
  };

  updateRequestTable = requestId => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };

    axios
      .get(
        Domain +
          "api/admins/update-payment-request/" +
          requestId +
          "/" +
          this.state.adminId,
        {
          headers: headers
        }
      )
      .then(response => {
        alert(response.data.message);
        this.setState({
          message: response.data.message,
          status: "Transfer Completed",
          completed: true,
          finish: false
        });
        this.handleNext();
      })
      .catch(error => {
        this.setState({ message: error.message });
      });
  };

  handleClose = () => {
    this.setState({
      dialog: false
    });
    this.handleReset();
  };

  sendOtp = () => {
    alert("OTP: " + this.state.otp + " artisanId: " + this.state.artisanId);
    this.finalizeTransfer(this.state.otp);
  };

  checkBankCodes = slug => {
    if (slug == "access-bank") {
      return "044";
    } else if (slug == "citibank-nigeria") {
      return "023";
    } else if (slug == "diamond-bank") {
      return "063";
    } else if (slug == "ecobank-nigeria") {
      return "050";
    } else if (slug == "enterprise-bank") {
      return "084";
    } else if (slug == "fidelity-bank") {
      return "070";
    } else if (slug == "first-bank-of-nigeria") {
      return "011";
    } else if (slug == "first-city-monument-bank") {
      return "214";
    } else if (slug == "guaranty-trust-bank") {
      return "058";
    } else if (slug == "heritage-bank") {
      return "030";
    } else if (slug == "keystone-bank") {
      return "082";
    } else if (slug == "mainstreet-bank") {
      return "014";
    } else if (slug == "skye-bank") {
      return "076";
    } else if (slug == "stanbic-ibtc-bank") {
      return "221";
    } else if (slug == "standard-chartered-bank") {
      return "068";
    } else if (slug == "sterling-bank") {
      return "232";
    } else if (slug == "union-bank-of-nigeria") {
      return "032";
    } else if (slug == "united-bank-for-africa") {
      return "033";
    } else if (slug == "unity-bank") {
      return "215";
    } else if (slug == "wema-bank") {
      return "035";
    } else if (slug == "zenith-bank") {
      return "057";
    } else {
      return "not a bank slug";
    }
  };

  getPendingPaymentRequests = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };

    axios
      .get(Domain + "api/admins/get-pending-payment-requests", {
        headers: headers
      })
      .then(response => {
        this.setState({
          paymentRequests: response.data.paymentRequests
        });
      })
      .catch(error => {
        alert(error.message);
      });
  };

  getConfirmedPayments = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };

    axios
      .get(Domain + "api/admins/get-confirmed-payments", {
        headers: headers
      })
      .then(response => {
        this.setState({
          confirmedPayments: response.data.paymentRequests
        });
      })
      .catch(error => {
        alert(error.message);
      });
  };

  getSteps = () => {
    return [
      "Verify Account",
      "Verify transfer recipient",
      "Initiate Transfer",
      "Finalize Transfer"
    ];
  };

  getStepContent = stepIndex => {
    switch (stepIndex) {
      case 0:
        return "Checking if artisan has a verified account...";
      case 1:
        return "Checking if artisan is a citiworks transfer recipient...";
      case 2:
        return "Initiating transfer...";
      case 3:
        return "Finalizing transfer...";
      default:
        return "Unknown stepIndex";
    }
  };

  setActiveStep(prevActiveStep) {
    return prevActiveStep;
  }

  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1
    });
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  handleChange = name => ({ target: { value } }) => {
    this.setState({
      [name]: value
    });
  };

  finish = () => {
    this.handleClose();
    window.location.reload();
  };

  render() {
    const { dialog, activeStep, otp, disable, finish } = this.state;
    let steps = this.getSteps();

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Typography>
            NOTE: Be sure you have gone through all the transactions before
            clicking on the authorize payment button to pay the artisan.
          </Typography>
          <Card>
            <CardHeader color="rose">
              <h4 className={this.classes.cardTitleWhite}>
                Payment Requests table
              </h4>
              <p className={this.classes.cardCategoryWhite}>
                All Pending Payment Requests are listed here.
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="rose"
                tableHead={[
                  "ArtisanID",
                  "Name",
                  "Amount",
                  "Current Balance",
                  "Category",
                  "Action"
                ]}
                tableData={this.state.paymentRequests.map(
                  (paymentRequest, index) => [
                    paymentRequest.artisan_id,
                    paymentRequest.artisan_name,
                    paymentRequest.amount,
                    paymentRequest.current_balance,
                    paymentRequest.category,
                    <Button
                      onClick={() => {
                        // this.setState({
                        //   dialog: true
                        // });
                        this.checkifArtisanIsARecipient(
                          paymentRequest.artisan_id,
                          paymentRequest.id,
                          paymentRequest.amount
                        );
                      }}
                      color="rose"
                    >
                      Authorize Payout
                    </Button>
                  ]
                )}
              />
            </CardBody>
          </Card>
        </GridItem>
        <br />
        <br />
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info">
              <h4 className={this.classes.cardTitleWhite}>
                Confirmed Payments table
              </h4>
              <p className={this.classes.cardCategoryWhite}>
                All Confirmed Payments are listed here.
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="info"
                tableHead={[
                  "Authorised by",
                  "Artisan Name",
                  "Amount",
                  "Balance(then)",
                  "Category"
                ]}
                tableData={this.state.confirmedPayments.map(
                  (paymentRequest, index) => [
                    paymentRequest.first_name + " " + paymentRequest.last_name,
                    paymentRequest.artisan_name,
                    paymentRequest.amount,
                    paymentRequest.current_balance,
                    paymentRequest.category
                  ]
                )}
              />
            </CardBody>
          </Card>
        </GridItem>
        <div>
          <Dialog
            open={dialog}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>Artisan Payment Process</DialogTitle>
            <DialogContent>
              <DialogContentText>{this.state.status}</DialogContentText>
              <div className={this.classes.root}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map(label => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <div>
                  {activeStep === steps.length ? (
                    <div>
                      <Typography className={this.classes.instructions}>
                        All steps completed.
                      </Typography>
                      <Button onClick={this.handleReset}>Reset</Button>
                    </div>
                  ) : (
                    <div>
                      <Typography className={this.classes.instructions}>
                        {() => {
                          this.getStepContent(activeStep);
                        }}
                      </Typography>
                      {this.state.completed ? null : (
                        <GridContainer>
                          <LinearProgress />
                          <LinearProgress color="secondary" />
                        </GridContainer>
                      )}

                      <br />
                      {/* <div>
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={this.classes.backButton}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleNext}
                        >
                          {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
              <TextField
                disabled={disable}
                id="otp"
                label="Enter OTP"
                type="number"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={this.handleChange("otp")}
                variant="filled"
                value={otp}
              />
              <Button
                disabled={disable}
                onClick={this.sendOtp}
                color="rose"
                autoFocus
              >
                Send Otp
              </Button>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleClose}
                className={this.classes.backButton}
              >
                Cancel
              </Button>
              <Button
                onClick={this.finish}
                disabled={finish}
                color="primary"
                autoFocus
              >
                Finish
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </GridContainer>
    );
  }
}
