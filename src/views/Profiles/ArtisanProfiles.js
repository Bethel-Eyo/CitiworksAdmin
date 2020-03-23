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
      expanded: false,
      artisan: {}
    };
  }

  componentDidMount() {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get("http://citiworksapi.test/api/admins/artisan-profiles", {
        headers: headers
      })
      .then(response => {
        this.setState({
          message: "successful",
          profiles: response.data.artisanprofiles
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
        return AppState.user_token;
      }
    }
  };
  a;

  getDetails = index => {
    // alert(index);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get("http://citiworksapi.test/api/admins/artisan/" + index, {
        headers: headers
      })
      .then(response => {
        this.setState({
          artisan: response.data.artisan
        });
      });
  };

  classes = () => {
    return useStyles();
  };
  render() {
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
                    color="rose"
                    onClick={() => this.getDetails(profile.artisan_id)}
                  >
                    View Details
                  </Button>
                  // <img
                  //   // src="http://bit.ly/2WjUOvx"
                  //   src={profile.profile_picture}
                  //   width="50"
                  //   height="50"
                  //   alt="..."
                  // />
                ])}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <RecipeReviewCard name={this.state.artisan.first_name} />
        </GridItem>
      </GridContainer>
    );
  }
}
