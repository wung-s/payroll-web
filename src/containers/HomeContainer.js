import React, { Component } from "react"
import moment from "moment"
import axios from "../helper/Axios"

import Home from "../components/Home"

class HomeContainer extends Component {
  state = {
    employeesGrp: {},
    recordsByEmployee: {},
    groupById: {},
    file: null
  }

  componentDidMount() {
    this.fetchAndSetUpData()
  }

  fetchAndSetUpData = () => {
    this.fetchData().then(resp => {
      const records = resp[0].data
      const groups = resp[1].data
      const groupById = groups.reduce((res, e) => {
        res[e.id] = e
        return res
      }, {})

      const employeesGrp = this.employeeWithGrp(records)
      const recordsByEmployee = this.recordsByEmployee(records)
      this.setState(() => {
        return {
          groupById,
          employeesGrp,
          recordsByEmployee
        }
      })
    })
  }

  handleFileSelect = e => {
    const file = e.target.files[0]
    if (file) {
      this.setState(() => {
        return {
          file
        }
      })
    }
  }

  handleUpload = () => {
    const formData = new FormData()
    formData.append("myfile", this.state.file)

    axios()
      .post("/records/upload", formData)
      .then(resp => {
        this.setState(() => ({
          file: null
        }))
        this.fetchAndSetUpData()
      })
  }

  recordsByEmployee = records => {
    const recordsByEmployee = records.reduce((res, e) => {
      if (res[e.employee]) {
        res[e.employee].push(e)
      } else {
        res[e.employee] = [e]
      }
      return res
    }, {})

    const result = Object.keys(recordsByEmployee).reduce((res, e) => {
      res[e] = this.calculatePaymentWithRange(recordsByEmployee[e])
      return res
    }, {})

    return result
  }

  employeeWithGrp = records => {
    const employeesGrp = records.reduce((res, e) => {
      res[e.employee] = { groupID: e.groupID }
      return res
    }, {})

    return employeesGrp
  }

  calculatePaymentWithRange = (records = [], rate = 1) => {
    const result = records.reduce((res, elem) => {
      const mm = moment(elem.workDate)
      const date = mm.get("date")
      let lower, upper
      if (date <= 15) {
        lower = "01/" + mm.format("MM/YYYY")
        upper = "15/" + mm.format("MM/YYYY")
      } else {
        lower = "16/" + mm.format("MM/YYYY")
        upper = mm.endOf("month").format("DD") + "/" + mm.format("MM/YYYY")
      }

      const range = lower + " - " + upper

      //check for existing range
      if (Object.keys(res).includes(range)) {
        res[range].durationHrs += elem.durationHrs
      } else {
        res[range] = { durationHrs: elem.durationHrs }
      }
      return res
    }, {})
    return result
  }

  fetchData = () => {
    return Promise.all([axios().get("/records"), axios().get("/groups")])
  }

  render() {
    return (
      <Home
        {...this.state}
        onFileSelect={this.handleFileSelect}
        onUpload={this.handleUpload}
      />
    )
  }
}

export default HomeContainer
