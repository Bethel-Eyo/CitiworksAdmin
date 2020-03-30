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
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import BugReport from "@material-ui/icons/BugReport";
import Tasks from "components/Tasks/Tasks.js";
import { bugs, website, server } from "variables/general.js";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Button from "components/CustomButtons/Button.js";
import axios from "axios";
import { Pagination } from "@material-ui/lab";
import CardFooter from "components/Card/CardFooter";
import { TextField } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
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

export default class Artisans extends React.Component {
  constructor() {
    super();
    this.state = {
      artisans: [],
      message: "",
      itemsCountPerPage: 1,
      totalItemsCount: 1,
      pageRangeDisplayed: 3,
      token: "",
      search: "",
      page: 1
    };
  }

  classes = () => {
    return useStyles();
  };

  componentDidMount() {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };
    axios
      .get(Domain + "api/admins/artisans", {
        headers: headers
      })
      .then(response => {
        this.setState({
          message: "successful",
          artisans: response.data.artisans.data,
          rowsPerPage: response.data.artisans.per_page,
          totalItemsCount: response.data.artisans.last_page
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

  setPage(page) {
    return page + 1;
  }

  updateSearch = e => {
    this.setState({
      search: e.target.value.substr(0, 20)
    });
  };

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
      .get(Domain + "api/admins/artisans?page=" + value, {
        headers: headers
      })
      .then(response => {
        this.setState({
          artisans: response.data.artisans.data,
          itemsCountPerPage: response.data.artisans.per_page,
          totalItemsCount: response.data.artisans.last_page,
          page: response.data.artisans.current_page
        });
      });
  }

  render() {
    const { page } = this.state;

    let filteredArtisans = this.state.artisans.filter(artisan => {
      return (
        artisan.first_name
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1
      );
    });

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4} />
            <GridItem xs={12} sm={12} md={4} />
            <GridItem xs={12} sm={12} md={4}>
              <TextField
                id="search"
                label="Search"
                variant="outlined"
                // style={{ width: "100%" }}
                onChange={this.updateSearch}
                value={this.state.search}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <Card>
            <CardHeader color="danger">
              <h4 className={this.classes.cardTitleWhite}>Artisans Table</h4>
              <p className={this.classes.cardCategoryWhite}>
                This is a list of all the Artisans in Citiworks
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["artisan-id", "Name", "Email", "Action"]}
                tableData={filteredArtisans.map((artisan, index) => [
                  artisan.id,
                  artisan.first_name + " " + artisan.last_name,
                  artisan.email,
                  <Button color="danger">Copy ID</Button>
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
      </GridContainer>
    );
  }
}
