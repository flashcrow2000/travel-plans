import React, { useState } from "react";
import styles from "./styles.module.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function EditProfile(props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function submitForm(ev) {
    ev.preventDefault();
    if (newPassword !== "") {
      // change password flow
      props.changePassword(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      setRepeatNewPassword("");
    }
  }
  function validateForm() {
    if (oldPassword === "") return false;
    if (newPassword === "" || repeatNewPassword === "") return false;
    if (newPassword !== repeatNewPassword) return false;
    return true;
  }
  const basicUserView = (
    <>
      <h4 className={styles.spacer}>Change password</h4>
      <form onSubmit={submitForm}>
        <div className="form-group">
          <label htmlFor="oldPasswordInput">Old password</label>
          <input
            value={oldPassword}
            onChange={ev => setOldPassword(ev.target.value)}
            type="password"
            className="form-control"
            id="oldPasswordInput"
            placeholder="old password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPasswordInput">New password</label>
          <input
            value={newPassword}
            onChange={ev => setNewPassword(ev.target.value)}
            type="password"
            className="form-control"
            id="newPasswordInput"
            placeholder="new password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPasswordRepeatInput">Repeat new password</label>
          <input
            value={repeatNewPassword}
            onChange={ev => setRepeatNewPassword(ev.target.value)}
            type="password"
            className="form-control"
            id="newPasswordRepeatInput"
            placeholder="repeat new password"
          />
        </div>
        {props.passwordError && (
          <div style={{ color: "red" }} className={styles.spacer}>
            {"Old password doesn't match the one we have in our records!"}
          </div>
        )}
        {props.passwordSuccess && (
          <div style={{ color: "green" }} className={styles.spacer}>
            {
              "Password changed succesfully. Use the new password on your next login."
            }
          </div>
        )}
        <div className={styles.spacer}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!validateForm()}
          >
            Submit changes
          </button>
        </div>
      </form>
      <h4 className={styles.spacer}>Delete your acount (permanently)</h4>
      <button onClick={handleShow} className="btn btn-danger">
        Delete account
      </button>
    </>
  );

  const supervisorUserView = (
    <>
      <h4 className={styles.spacer}>Change password</h4>
      <form onSubmit={submitForm}>
        <div className="form-group">
          <label htmlFor="newPasswordInput">New password</label>
          <input
            type="email"
            className="form-control"
            id="newPasswordInput"
            placeholder="new password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="roleSelect">Select role</label>
          <select className="form-control" id="roleSelect">
            <option selected={props.user.profile.role === "basic"}>
              basic
            </option>
            <option selected={props.user.profile.role === "supervisor"}>
              supervisor
            </option>
            <option selected={props.user.profile.role === "admin"}>
              admin
            </option>
          </select>
        </div>
        <div className={styles.spacer}>
          <button type="submit" className="btn btn-primary">
            Submit changes
          </button>
        </div>
      </form>
      <h4 className={styles.spacer}>Delete your acount (permanently)</h4>
      <button onClick={handleShow} className="btn btn-danger">
        Delete account
      </button>
    </>
  );
  return (
    <>
      <Modal show={show} onHide={handleClose} style={{ opacity: 1 }}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deleting the user also removes all the attached trips!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              props.deleteUser();
              handleClose();
            }}
          >
            Delete user
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={styles.container}>
        {props.role === "basic" ? basicUserView : supervisorUserView}
      </div>
    </>
  );
}
