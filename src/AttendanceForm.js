// // import react, * as React from "react";
// // import { Page, Grid } from "tabler-react";
// // import SiteWrapper from "./SiteWrapper.react";
// // import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
// // import { withFormik } from 'formik';

// // const AttendanceForm = ({ values, handleChange, handleSubmit, errors, touched, isSubmitting }) => {
// //   return (
// //     <SiteWrapper>
// //       <Page.Card
// //             title="Employee Registration"
// //         ></Page.Card>
// //         <Grid.Col md={6} lg={6} className="align-self-center">
// //         <Form onSubmit={handleSubmit}>
// //           <FormGroup>
// //             {touched.id && errors.id && <p className="red">{errors.id}</p>}
// //             <Label for="id">Employee ID</Label>
// //             <Input 
// //               type="number" 
// //               name="id"
// //               value={values.id}
// //               onChange={handleChange}
// //               id="id" 
// //               placeholder="Employee ID" 
// //             />
// //           </FormGroup>
// //           <FormGroup>
// //             {touched.status && errors.status && <p className="red">{errors.status}</p>}
// //             <Label for="status">Status</Label>
// //             <Input type="select" name="status" id="status" value={values.status} onChange={handleChange}>
// //               <option>Select Status</option>
// //               <option>Present</option>
// //               <option>Absent</option>
// //             </Input>
// //           </FormGroup>

// //           <FormGroup>
// //             {touched.date && errors.date && <p className="red">{errors.date}</p>}
// //             <Label for="date">Date</Label>
// //             <Input
// //               type="date"
// //               name="date"
// //               id="date"
// //               placeholder="datetime placeholder"
// //               value={values.date} 
// //               onChange={handleChange}
// //             />
// //           </FormGroup>
// //           <Button color="primary" disabled={isSubmitting}>Submit</Button>
// //         </Form>
// //     </Grid.Col>
// //     </SiteWrapper>
// //   );
// // }

// // const FormikApp = withFormik({
// //   mapPropsToValues({ username, password }) {
// //     return { username, password }
// //   },
// //   handleSubmit(values, { props, resetForm, setErrors, setSubmitting }) {
// //     console.log(JSON.stringify(values))
// //     fetch('http://localhost:8085/api/v1/attendance/create', {
// //       method: 'POST',
// //       body: JSON.stringify(values),
// //       headers: {
// //           'Content-Type': 'application/json'
// //     }})
// //   }
// // })(AttendanceForm);

// // export default FormikApp

// import react, * as React from "react";
// import { Page, Grid } from "tabler-react";
// import SiteWrapper from "./SiteWrapper.react";
// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
// import { withFormik } from 'formik';

// const AttendanceForm = ({ values, handleChange, handleSubmit, errors, touched, isSubmitting }) => {
//   return (
//     <SiteWrapper>
//       <Page.Card title="Employee Attendance"></Page.Card>

//       <Grid.Col md={6} lg={6} className="align-self-center">
//         <Form onSubmit={handleSubmit}>

//           {/* Employee ID */}
//           <FormGroup>
//             <Label for="id">Employee ID</Label>
//             <Input
//               type="number"
//               name="id"
//               id="id"
//               value={values.id}
//               onChange={handleChange}
//               placeholder="Employee ID"
//             />
//           </FormGroup>

//           {/* Status */}
//           <FormGroup>
//             <Label for="status">Status</Label>
//             <Input
//               type="select"
//               name="status"
//               id="status"
//               value={values.status}
//               onChange={handleChange}
//             >
//               <option value="">Select Status</option>
//               <option value="Present">Present</option>
//               <option value="Absent">Absent</option>
//             </Input>
//           </FormGroup>

//           {/* Date */}
//           <FormGroup>
//             <Label for="date">Date</Label>
//             <Input
//               type="date"
//               name="date"
//               id="date"
//               value={values.date}
//               onChange={handleChange}
//             />
//           </FormGroup>

//           <Button color="primary" disabled={isSubmitting}>Submit</Button>
//         </Form>
//       </Grid.Col>
//     </SiteWrapper>
//   );
// };

// const FormikApp = withFormik({

//   // FIX 1: Correct initial form fields
//   mapPropsToValues() {
//     return {
//       id: "",
//       status: "",
//       date: ""
//     };
//   },

//   // FIX 2: Backend expects employee_id, not "id"
//   handleSubmit(values, { resetForm, setSubmitting }) {

//     const payload = {
//       employee_id: values.id,
//       status: values.status,
//       date: values.date
//     };

//     console.log("Submitting payload:", payload);

//     fetch("http://localhost:8085/api/v1/attendance/create", {
//       method: "POST",
//       body: JSON.stringify(payload),
//       headers: {
//         "Content-Type": "application/json"
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         console.log("Success:", data);
//         resetForm();
//         setSubmitting(false);
//         alert("Attendance submitted successfully!");
//       })
//       .catch(err => {
//         console.error("Error:", err);
//         setSubmitting(false);
//         alert("Error submitting attendance");
//       });
//   }

// })(AttendanceForm);

// export default FormikApp;

import react, * as React from "react";
import { Page, Grid } from "tabler-react";
import SiteWrapper from "./SiteWrapper.react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withFormik } from 'formik';

const AttendanceForm = ({ values, handleChange, handleSubmit, isSubmitting }) => {
  return (
    <SiteWrapper>
      <Page.Card title="Employee Attendance"></Page.Card>

      <Grid.Col md={6} lg={6} className="align-self-center">
        <Form onSubmit={handleSubmit}>
         {/* Employee Name */}
          <FormGroup>
            <Label for="name">Employee Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Employee Name"
            />
          </FormGroup>

           {/* Employee Id */}
          <FormGroup>
            <Label for="id">Employee ID</Label>
            <Input
              type="text"
              id="id"
              name="id"
              value={values.id}
              onChange={handleChange}
              placeholder="Employee ID"
            />
          </FormGroup>

          {/* Status */}
          <FormGroup>
            <Label for="status">Status</Label>
            <Input
              type="select"
              name="status"
              id="status"
              value={values.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </Input>
          </FormGroup>

          {/* Date */}
          <FormGroup>
            <Label for="date">Date</Label>
            <Input
              type="date"
              name="date"
              id="date"
              value={values.date}
              onChange={handleChange}
            />
          </FormGroup>

          <Button color="primary" disabled={isSubmitting}>Submit</Button>
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
      status: "",
      date: ""
    };
  },

  handleSubmit(values, { resetForm, setSubmitting }) {

  const payload = {
    id: values.id,       // ✔ use what user typed
    name: values.name,
    status: values.status,
    date: values.date
  };

  console.log("Submitting payload:", payload);

  fetch("http://localhost:8085/api/v1/attendance/create", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Server error");
      }
      return res.json();
    })
    .then(data => {
      console.log("Success:", data);
      alert("Attendance submitted successfully!");
      resetForm();
      setSubmitting(false);
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Error submitting attendance");
      setSubmitting(false);
    });
}


})(AttendanceForm);

export default FormikApp;
