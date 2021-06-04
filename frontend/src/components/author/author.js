import React, { Component } from "react"
import { Modal, Button } from "react-bootstrap"
import swal from "sweetalert"
// import { Link } from "react-router-dom";
// import { Button as MaterialButton } from "@material-ui/core/";
// import ErrorMessage from "../message/errorMessage";
// import SuccessMessage from "../message/successMessage";
import Print from "../print/Print"
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
pdfMake.vfs = pdfFonts.pdfMake.vfs

class Author extends Component {
  constructor() {
    super()
    this.state = {
      pagination: [],
      currname: null,
      show: false,
      name: null,
      id: null,
      noti: null,
      file: null,
      currType: "add"
    }
  }
  componentWillMount() {
    let tmp = []
    for (let i = 1; i <= this.props.totalpage; i++) {
      tmp.push(i)
    }
    this.setState({ pagination: tmp })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.totalpage !== this.props.totalpage) {
      let tmp = []
      for (let i = 1; i <= nextProps.totalpage; i++) {
        tmp.push(i)
      }
      this.setState({ pagination: tmp })
    }
    if (nextProps.isadd === false) {
      this.setState({
        noti: "Please Change name"
      })
    } else if (nextProps.isadd === true) {
      this.setState({
        noti: "",
        id: null,
        name: "",
        currType: "add"
      })
    }
    if (nextProps.isupdate === false) {
      this.setState({
        noti: "update fail"
      })
    } else if (nextProps.isupdate === true) {
      this.setState({
        noti: "",
        id: null,
        name: "",
        currType: "add"
      })
    }
  }

  confirmDelete(id) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        this.props.deleteAuthor(id)
        swal("Poof! Your Author data has been deleted!", {
          icon: "success"
        })
      }
    })
  }

  handleChangeImg = img => {
    // console.log(img);
    if (img === undefined) return
    this.setState({
      file: img
    })
  }

  handleClose = () => {
    this.setState({
      show: false
    })
  }
  handleShow = () => {
    this.setState({ show: true })
  }

  renderPagination() {
    if (this.state.pagination.length === 0) {
      return null
    } else {
      return (
        <ul className="pagination pagination-custom col-md-6 offset-md-3">
          <li onClick={() => this.props.backPage()}>
            <a>&laquo;</a>
          </li>
          {this.state.pagination.map((element, index) => {
            if (this.props.page === element) {
              return (
                <li
                  className="active"
                  onClick={() => this.props.setPage(element)}
                >
                  <a>{element}</a>
                </li>
              )
            } else {
              return (
                <li onClick={() => this.props.setPage(element)}>
                  <a>{element}</a>
                </li>
              )
            }
          })}
          <li onClick={() => this.props.nextPage()}>
            <a>&raquo;</a>
          </li>
        </ul>
      )
    }
  }

  printAs = e => {
    const downloadAs = e.target.value

    switch (downloadAs) {
      case "pdf":
        var docDefinition = {
          content: [
            //Header
            {
              table: {
                widths: ["auto", "*"],

                body: [
                  [
                    {
                      text: "BOOK SHOP WEB",
                      style: "mainheader",
                      bold: true,
                      marginTop: 10
                    },

                    {
                      width: "*",
                      style: "usersOrders",
                      marginBottom: 30,
                      stack: [
                        {
                          style: "h2",
                          text: `Name: ${this.props.currentUser.user.firstName}`
                        },
                        {
                          style: "h2",
                          text: `Email: ${this.props.currentUser.user.email}`
                        }
                      ]
                    }
                  ]
                ]
              },
              layout: {
                hLineWidth: function (line) {
                  return line === 1
                },
                vLineWidth: function () {
                  return 0
                },
                paddingBottom: function () {
                  return 5
                }
              }
            },

            //Vitals Details
            {
              style: "header",
              table: {
                widths: "*",
                body: [
                  [
                    {
                      border: ["#5bc0de", false, false, false],
                      text: "Author List"
                    }
                  ]
                ]
              }
            },

            this.props.author.length > 0
              ? {
                  layout: {
                    hLineWidth: function () {
                      return 0
                    },
                    vLineWidth: function () {
                      return 0
                    },
                    paddingBottom: function () {
                      return 5
                    }
                  },
                  table: {
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: "S.No",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white"
                        },
                        {
                          text: "ID",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white"
                        },
                        {
                          text: "NAME",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white"
                        },
                        // {
                        //   text: "EMAIL",
                        //   bold: true,
                        //   fillColor: "#2B2B52",
                        //   color: "white",
                        // },
                        // {
                        //   text: "VERIFIED",
                        //   bold: true,
                        //   fillColor: "#2B2B52",
                        //   color: "white",
                        // },
                        {
                          text: "STATUS",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white"
                        },
                        {
                          text: "DATE",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white"
                        }
                      ],

                      ...this.props.author.map((u, i) => [
                        i + 1,
                        u._id,
                        u.name,
                        //  u.status,
                        u.status ? "Verified" : "Not paid",
                        // u.role,
                        u.createdAt.substring(0, 10)
                      ])
                    ]
                  },

                  fontSize: 8,
                  alignment: "center"
                }
              : null
          ],
          styles: {
            header: {
              fontSize: 12,
              marginBottom: 20,
              marginTop: 20,
              bold: true
            },
            mainheader: {
              fontSize: 15
            },

            usersOrders: {
              marginLeft: 315
            },

            h2: {
              marginTop: 5,
              fontSize: 7
            }
          }
        }
        pdfMake.createPdf(docDefinition).download("usersList.pdf")

        break
      case "excel":
        break

      default:
        break
    }
  }

  renderBtn = () => {
    if (this.state.currType === "add") {
      return (
        <div className="form-group">
          <div className="col-lg-offset-2 col-lg-10">
            <button
              onClick={() => this.props.addAuthor(this.state.name)}
              className="btn-custom"
            >
              Add
            </button>
            <button
              disabled
              onClick={() =>
                this.props.updateAuthor(this.state.id, this.state.name)
              }
              className="btn-custom"
            >
              Update
            </button>
            <button onClick={() => this.reset()} className="btn-custom">
              Reset
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="form-group">
          <div className="col-lg-offset-2 col-lg-10">
            <button
              disabled
              onClick={() => this.props.addAuthor(this.state.name)}
              className="btn-custom"
            >
              Add
            </button>
            <button
              onClick={() =>
                this.props.updateAuthor(this.state.id, this.state.name)
              }
              className="btn-custom"
            >
              Update
            </button>
            <button onClick={() => this.reset()} className="btn-custom">
              Reset
            </button>
          </div>
        </div>
      )
    }
  }

  reset = () => {
    this.setState({
      noti: "",
      id: null,
      show: false,
      name: "",
      currType: "add"
    })
  }

  render() {
    // console.log(this.state.pagination);

    return (
      <section id="main-content">
        <div className="row">
          <div className="col-lg-12">
            <h3 className="page-header">
              <i className="fa fa-table" /> Table
            </h3>
            <ol className="breadcrumb">
              <li>
                <i className="fa fa-home" />
                <a href="/dashboard">Home</a>
              </li>
              <li>
                <i className="fa fa-table" />
                Table
              </li>
              <li>
                <i className="fa fa-th-list" />
                Author Manager
              </li>
            </ol>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <section className="panel">
              <header className="panel-heading">Advanced Table</header>
              <table className="table table-striped table-advance table-hover">
                <tbody>
                  <tr>
                    <th>
                      <i className="icon_profile" /> Name
                    </th>
                    <th>
                      <i className="icon_profile" /> Status
                    </th>
                    <th>
                      <i className="icon_profile" /> Image
                    </th>
                    <th>
                      <i className="icon_cogs" /> Action
                    </th>
                  </tr>
                  {this.props.author.map((element, index) => {
                    return (
                      <tr>
                        <td>{element.name}</td>
                        <td>{element.isEnabled.toString()}</td>
                        <td>
                          <img
                            src={element.image}
                            style={{ maxWidth: "300px" }}
                            alt=""
                          />
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              onClick={() =>
                                this.setState({
                                  currname: element.name,
                                  name: element.name,
                                  id: element._id,
                                  currType: "update"
                                })
                              }
                              className="btn btn-success"
                            >
                              <i className="icon_check_alt2" />
                            </button>
                            <button
                              onClick={() => this.confirmDelete(element._id)}
                              className="btn btn-danger"
                            >
                              <i className="icon_close_alt2" />
                            </button>
                            <hr />
                            <button
                              onClick={() =>
                                this.props.deactivateAuthor(element._id)
                              }
                              className="btn btn-warning"
                            >
                              <i className="icon-gittip" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {this.renderPagination()}
            </section>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <section className="panel">
              <header className="panel-heading">Form validations</header>
              <div className="panel-body">
                <div className="form">
                  <div className="form-validate form-horizontal">
                    <div className="form-group ">
                      <label for="cname" className="control-label col-lg-2">
                        Name <span className="required">*</span>
                      </label>
                      <div className="col-lg-10">
                        <input
                          onChange={e => {
                            this.setState({
                              name: e.target.value
                            })
                          }}
                          value={this.state.name}
                          className="form-control"
                          id="cname"
                          name="fullname"
                          minlength="5"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                    {/* <div className="form-group ">
                      <label for="comment" className="control-label col-lg-2">
                        File upload
                      </label>
                      <div className="col-lg-10">
                        <input
                          className="form-control "
                          type="file"
                          id="ccomment"
                          name="comment"
                          required
                          onChange={(e) =>
                            this.handleChangeImg(e.target.files[0])
                          }
                        />
                      </div>
                    </div> */}

                    <div className="form-group">
                      <button
                        onClick={() => this.handleShow()}
                        className="btn-custom"
                      >
                        Upload
                      </button>
                    </div>

                    <Modal
                      show={this.state.show}
                      onHide={() => this.setState({ show: false })}
                      animation={false}
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                          Import excel file
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Please download this format excel
                        <button onClick={this.props.downloadFile}>
                          Download
                        </button>
                        to view file before import.
                        <hr />
                        <hr />
                        <div className="form-group ">
                          <label
                            for="comment"
                            className="control-label col-lg-2"
                          >
                            File upload
                          </label>
                          <div className="col-lg-10">
                            <input
                              className="form-control "
                              type="file"
                              id="ccomment"
                              name="comment"
                              required
                              onChange={e =>
                                this.handleChangeImg(e.target.files[0])
                              }
                            />
                          </div>
                          <button
                            onClick={() =>
                              this.props.uploadFile(this.state.file)
                            }
                            className="btn-custom"
                          >
                            Submit
                          </button>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => this.setState({ show: false })}
                        >
                          Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <div className="form-group">
                      <div className="col-lg-offset-2 col-lg-10">
                        <p>{this.state.noti}</p>
                      </div>
                    </div>

                    {this.renderBtn()}
                  </div>
                  <div className="clearfix">
                    <span className="float-left">
                      {/* <h1>Users ({count})</h1> */}
                    </span>

                    <span className="float-right">
                      <Print printAs={this.printAs} />
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    )
  }
}

export default Author
