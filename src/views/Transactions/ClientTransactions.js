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

export default class ClientTransactions extends React.Component {
  constructor() {
    super();
    this.state = {
      transactions: [],
      message: ""
    };
  }

  componentDidMount() {
    axios
      .get("http://citiworksapi.test/user-transactions")
      .then(response => {
        this.setState({
          message: "successful",
          transactions: response.data.userTransactions
        });
        console.log(response.users);
      })
      .catch(error => {
        this.setState({ message: error.message });
      });
  }

  classes = () => {
    return useStyles();
  };

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={this.classes.cardTitleWhite}>
                Client Transactions Table
              </h4>
              <p className={this.classes.cardCategoryWhite}>
                A list of the transactions carried out by all clients
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={[
                  "User ID",
                  "Amount",
                  "Paid with",
                  "Status",
                  "Reference Id",
                  "Description",
                  "Created at"
                ]}
                tableData={this.state.transactions.map((transaction, index) => [
                  transaction.user_id,
                  transaction.amount,
                  transaction.paid_with,
                  transaction.status,
                  transaction.reference_id,
                  transaction.description,
                  transaction.created_at
                ])}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
