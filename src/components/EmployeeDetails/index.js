import { AiOutlineEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";

import "./index.css";

const EmployeeDetails = (props) => {
  const {
    eachEmployee,
    deleteEmployee,
    changeIndividualCheckboxStatus,
  } = props;
  const { id, name, email, role, isChecked } = eachEmployee;

  const onClickDelete = () => {
    deleteEmployee(id);
  };

  const onChangeCheckboxStatus = () => {
    changeIndividualCheckboxStatus(id);
  };

  const isCheckedClassName = isChecked ? "checked" : "";
  return (
    <li className={`list-row ${isCheckedClassName}`}>
      <input
        type="checkbox"
        className="checkbox"
        checked={isChecked}
        onChange={onChangeCheckboxStatus}
      />
      <p className="employee-details">{name}</p>
      <p className="employee-details">{email}</p>
      <p className="employee-details">{role}</p>
      <p className="icons-column">
        <AiOutlineEdit className="react-icon" />
        <AiFillDelete className="react-icon" onClick={onClickDelete} />
      </p>
    </li>
  );
};

export default EmployeeDetails;
