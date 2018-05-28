import React from "react"
import PropTypes from "prop-types"
import Grid from "@material-ui/core/Grid"

const Content = props => (
  <Grid container>
    <Grid item xs={1} />
    <Grid item xs={10}>
      {props.children}
    </Grid>
    <Grid item xs={1} />
  </Grid>
)

Content.propTypes = {
  children: PropTypes.element.isRequired
}

export default Content
