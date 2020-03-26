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
import { Pagination } from "@material-ui/lab";
import CardFooter from "components/Card/CardFooter";

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

export default class ArtisanJobs extends React.Component {
  constructor() {
    super();
    this.state = {
      jobs: [],
      message: "",
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
      .get("http://citiworksapi.test/api/admins/artisan-jobs", {
        headers: headers
      })
      .then(response => {
        this.setState({
          message: "successful",
          jobs: response.data.jobs.data,
          rowsPerPage: response.data.jobs.per_page,
          totalItemsCount: response.data.jobs.last_page
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
      .get("http://citiworksapi.test/api/admins/artisan-jobs?page=" + value, {
        headers: headers
      })
      .then(response => {
        this.setState({
          jobs: response.data.jobs.data,
          itemsCountPerPage: response.data.jobs.per_page,
          totalItemsCount: response.data.jobs.last_page,
          page: response.data.jobs.current_page
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
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="danger">
              <h4 className={this.classes.cardTitleWhite}>
                Artisan Jobs Table
              </h4>
              <p className={this.classes.cardCategoryWhite}>
                A list of the jobs of all artisans
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={[
                  "Artisan ID",
                  "Job Title",
                  "Category",
                  "Location",
                  "Client Name",
                  "Rating",
                  "COM",
                  "SC",
                  "CC",
                  "Created at"
                ]}
                tableData={this.state.jobs.map((job, index) => [
                  job.artisan_id,
                  job.job_title,
                  job.category,
                  job.job_location,
                  job.client_name,
                  job.rating,
                  job.cost_of_materials,
                  job.service_charge,
                  job.citiworks_commission,
                  job.created_at
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
