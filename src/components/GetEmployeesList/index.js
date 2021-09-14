import { Component } from "react";

import Loader from "react-loader-spinner";

import EmployeeDetails from "../EmployeeDetails";
import NotFound from "../NotFound";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class GetEmployeesList extends Component {
  state = {
    employeesList: [],
    apiStatus: apiStatusConstants.initial,
    searchInput: "",
  };

  componentDidMount() {
    this.getEmployeesList();
  }

  getEmployeesList = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const url =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
    const response = await fetch(url);
    if (response.ok === true) {
      const data = await response.json();
      const formattedData = data.map((eachEmployee) => ({
        ...eachEmployee,
        isChecked: false,
      }));
      this.setState({
        employeesList: formattedData,
        apiStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  updateCheckStatus = () => {
    const { employeesList } = this.state;
    const updatedList = employeesList.map((eachEmployee) => {
      const { isChecked } = eachEmployee;
      return { ...eachEmployee, isChecked: !isChecked };
    });
    this.setState({ employeesList: updatedList });
  };

  deleteEmployee = (id) => {
    const { employeesList } = this.state;
    const listWithDeletedEmployee = employeesList.filter(
      (eachEmployee) => eachEmployee.id !== id
    );
    this.setState({ employeesList: listWithDeletedEmployee });
  };

  changeIndividualCheckboxStatus = (id) => {
    const { employeesList } = this.state;
    const Employee = employeesList.find(
      (eachEmployee) => eachEmployee.id === id
    );
    const { isChecked } = Employee;
    const updatedList = employeesList.map((eachEmployee) => {
      if (eachEmployee.id === id) {
        return { ...eachEmployee, isChecked: !isChecked };
      }
      return eachEmployee;
    });
    this.setState({ employeesList: updatedList });
  };

  deleteSelectedEmployees = () => {
    const { employeesList } = this.state;
    const updatedEmployeesList = employeesList.filter(
      (eachEmployee) => eachEmployee.isChecked === false
    );
    this.setState({ employeesList: updatedEmployeesList });
  };

  deleteAllEmployees = () => {
    this.setState({ employeesList: [] });
  };

  onChangeUpdateSearchInput = (event) => {
    this.setState({ searchInput: event.target.value });
    const { employeesList } = this.state;
    const filteredList = employeesList.filter((eachEmployee) => {
      const { name, email, role } = eachEmployee;
      const combinedString = name + email + role;
      return combinedString
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    this.setState({ employeesList: filteredList });
  };

  renderSuccessView = () => {
    const { employeesList } = this.state;
    return (
      <div className="list-container">
        {employeesList.map((eachEmployee) => (
          <EmployeeDetails
            key={eachEmployee.id}
            eachEmployee={eachEmployee}
            deleteEmployee={this.deleteEmployee}
            changeIndividualCheckboxStatus={this.changeIndividualCheckboxStatus}
          />
        ))}
      </div>
    );
  };

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  );

  renderOutput = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case "SUCCESS":
        return this.renderSuccessView();
      case "IN_PROGRESS":
        return this.renderLoadingView();
      case "FAILURE":
        return <NotFound />;
      default:
        return null;
    }
  };

  render() {
    const { searchInput } = this.state;
    return (
      <div className="employees-container">
        <input
          type="text"
          value={searchInput}
          className="search-input"
          onChange={this.onChangeUpdateSearchInput}
          placeholder="Search by name, email or role"
        />
        <div className="delete-buttons-container">
          <button
            type="button"
            className="delete-selected"
            onClick={this.deleteSelectedEmployees}
          >
            Delete Selected
          </button>
          <button
            type="button"
            className="delete-all"
            onClick={this.deleteAllEmployees}
          >
            Delete All
          </button>
        </div>
        <ul className="employees-list-container">
          <li className="list-row">
            <input
              type="checkbox"
              className="checkbox"
              onChange={this.updateCheckStatus}
            />
            <p className="employee-details bold">Name</p>
            <p className="employee-details bold">Email</p>
            <p className="employee-details bold">Role</p>
            <p className="employee-details bold">Action</p>
          </li>
          {this.renderOutput()}
        </ul>
      </div>
    );
  }
}

export default GetEmployeesList;
