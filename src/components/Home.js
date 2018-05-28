import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

import Content from "./Content"

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
})

const Home = props => {
  const { classes } = props
  const renderItem = () => {
    const employees = Object.keys(props.recordsByEmployee)
    let items = []

    items = employees.reduce((res, id) => {
      const emp = props.recordsByEmployee[id]

      const tmp = Object.keys(emp).map(range => {
        return (
          <TableRow key={`${range}-${id}`}>
            <TableCell component="th" scope="row">
              {id}
            </TableCell>
            <TableCell numeric>{range}</TableCell>
            <TableCell numeric>
              {"$ " +
                Number.parseFloat(
                  emp[range].durationHrs *
                    props.groupById[props.employeesGrp[id].groupID].hourlyRate
                ).toPrecision(4)}
            </TableCell>
          </TableRow>
        )
      })

      return res.concat(tmp)
    }, [])

    return items
  }

  return (
    <Content>
      <Grid container>
        <Grid item xs={12}>
          <input
            accept="text/csv"
            className={classes.input}
            id="flat-button-file"
            type="file"
            onChange={props.onFileSelect}
          />
          <label htmlFor="flat-button-file">
            <Button component="span" className={classes.button}>
              Select File
            </Button>
          </label>

          <Button
            color="secondary"
            onClick={props.onUpload}
            disabled={props.file === null}
          >
            Upload
          </Button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell numeric>Pay Period</TableCell>
                <TableCell numeric>Amount Paid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderItem()}</TableBody>
          </Table>
        </Grid>
      </Grid>
    </Content>
  )
}

Home.propTypes = {
  recordsByEmployee: PropTypes.object.isRequired,
  onUpload: PropTypes.func.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  groupById: PropTypes.object.isRequired,
  employeesGrp: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)
