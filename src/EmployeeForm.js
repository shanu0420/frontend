import react, * as React from "react";
import { Page, Grid } from "tabler-react";
import SiteWrapper from "./SiteWrapper.react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { withFormik } from "formik";
import { config } from "./config";

const EmployeeForm = ({ values, handleChange, handleSubmit, isSubmitting }) => {
  return (
    <SiteWrapper>
      <Page.Card title="Employee Registration" />

      <Grid.Col md={6} lg={6} className="align-self-center">
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="id">Employee ID</Label>
            <Input type="text" name="id" value={values.id} onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" value={values.name} onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <Label for="address">Address</Label>
            <Input type="text" name="address" value={values.address} onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <Label for="email_id">Email ID</Label>
            <Input type="text" name="email_id" value={values.email_id} onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <Label for="phone_number">Phone Number</Label>
            <Input type="text" 
            name="phone_number"
            value={values.phone_number}
            onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <Label for="annual_package">Annual Package</Label>
            <Input
              type="text"
              name="annual_package"
              value={values.annual_package}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="designation">Designation</Label>
            <Input type="select" name="designation" value={values.designation} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="Developer">Developer</option>
              <option value="DevOps">DevOps</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="department">Department</Label>
            <Input type="select" name="department" value={values.department} onChange={handleChange}>
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="IT">IT</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="status">Status</Label>
            <Input type="select" name="status" value={values.status} onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="Current Employee">Current Employee</option>
              <option value="Ex-Employee">Ex-Employee</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="office_location">Office Location</Label>
            <Input
              type="select"
              name="office_location"
              value={values.office_location}
              onChange={handleChange}
            >
              <option value="">Select Location</option>
              <option value="Delaware">Delaware</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Noida">Noida</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="joining_date">Joining Date</Label>
            <Input
              type="date"
              name="joining_date"
              value={values.joining_date}
              onChange={handleChange}
            />
          </FormGroup>

          <Button color="primary" disabled={isSubmitting}>
            Submit
          </Button>
        </Form>
      </Grid.Col>
    </SiteWrapper>
  );
};

const FormikApp = withFormik({
  mapPropsToValues() {
    return {
      id: "",
      name: "",
      address: "",
      email_id: "",
      phone_number: "",
      annual_package: "",
      designation: "",
      department: "",
      status: "",
      office_location: "",
      joining_date: "",
    };
  },

  handleSubmit(values, { resetForm, setSubmitting }) {
    const payload = {
      id: values.id,
      name: values.name,
      address: values.address,
      email_id: values.email_id,
      phone_number: values.phone_number,
      annual_package: values.annual_package,
      designation: values.designation,
      department: values.department,
      status: values.status,
      office_location: values.office_location,
      joining_date: values.joining_date,
    };

    console.log("Submitting payload:", payload);

    fetch(`${config.EMPLOYEE_API}/create`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Employee added successfully!");
        console.log("Response:", data);
        resetForm();
        setSubmitting(false);
      })
      .catch((err) => {
        alert("Error creating employee");
        console.error(err);
        setSubmitting(false);
      });
  },
})(EmployeeForm);

export default FormikApp;
