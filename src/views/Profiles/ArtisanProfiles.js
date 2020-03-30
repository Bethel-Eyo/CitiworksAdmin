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
      artisan: {},
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
      page: 1
    };
  }

  componentDidMount() {
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
  a;

  getDetails = profile => {
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
      gender: profile.gender,
      certificate: profile.cert_file
    });
    axios
      .get(Domain + "api/admins/artisan/" + profile.artisan_id, {
        headers: headers
      })
      .then(response => {
        this.setState({
          artisan: response.data.artisan
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
    const { page } = this.state;
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
                  <Button color="rose" onClick={() => this.getDetails(profile)}>
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
      </GridContainer>
    );
  }
}
