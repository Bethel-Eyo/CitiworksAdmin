import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.name}
        subheader={props.email}
      />
      <CardMedia
        className={classes.media}
        image={props.dp}
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {"Artisan ID: " + props.id}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {"Created: " + props.createdAt}
          </Typography>
          <hr />
          <Typography variant="body2" color="textSecondary" component="p">
            {"Category: " + props.category}
          </Typography>
          <hr />
          <Typography variant="body2" color="textSecondary" component="p">
            {"Gender: " + props.gender}
          </Typography>
          <hr />
          <Typography>Certificate:</Typography>
          <CardMedia
            className={classes.media}
            image={props.certificate}
            title="Paella dish"
          />
          <br />
          <Typography variant="body2" color="textSecondary" component="p">
            {"Phone no: " + props.phoneNumber}
          </Typography>
          <hr />
          <Typography variant="body2" color="textSecondary" component="p">
            {"Bank: " + props.bankName}
          </Typography>
          <hr />
          <Typography variant="body2" color="textSecondary" component="p">
            {"Acct no: " + props.accountNumber}
          </Typography>
          <hr />
          <Typography variant="body2" color="textSecondary" component="p">
            {"Address: " + props.address}
          </Typography>
          <hr />
          <Typography variant="body2" color="textSecondary" component="p">
            {"Qualification: " + props.qualification}
          </Typography>
          {/* <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and
            set aside for 10 minutes.
          </Typography> */}
        </CardContent>
      </Collapse>
    </Card>
  );
}
