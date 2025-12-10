// // import react, * as React from "react";
// // import { Page, Grid, Table, Button } from "tabler-react";
// // import SiteWrapper from "./SiteWrapper.react";

// // class ListSalary extends React.Component {
// // 	constructor(props) {
// // 		super(props)
// // 		this.state = { data: [] }
// // 	}

// // 	loadData() {
// // 		fetch('http://localhost:8081/api/v1/salary/search/all')
// // 			.then(response => response.json())
// // 			.then(data => {
// // 				this.setState({data: data })
// // 		})
// // 			.catch(err => console.error(this.props.url, err.toString()))
// // 	}

// // 	componentDidMount() {
// // 		this.loadData()
// // 	}

// //   render() {
// //       return (
// //           <SiteWrapper>
// //           <Page.Card
// //               title="Salary List"
// //           ></Page.Card>
// //           <Grid.Col md={6} lg={10} className="align-self-center">
// //           <Table>
// //             <Table.Header>
// //                  <Table.ColHeader>Employee ID</Table.ColHeader>
// //                  <Table.ColHeader>Name</Table.ColHeader>
// //                  <Table.ColHeader>Salary</Table.ColHeader>
// //             </Table.Header>
// //             <Table.Body>
// //            { this.state.data.map((item, i) => {
// //                 return (
// //                     <Table.Row>
// //                         <Table.Col>{item.id}</Table.Col>
// //                         <Table.Col>{item.name}</Table.Col>
// //                         <Table.Col>{item.annual_package}</Table.Col>
// //                     </Table.Row>
// //                 );
// //                 })
// //             }
// //             </Table.Body>
// //             </Table>
// //           </Grid.Col>
// //           </SiteWrapper>
// //       );
// //   }
// // }
// // //
// // export default ListSalary;
// // //export default withTransaction('ListSalary', 'component')(ListSalary)

// import react, * as React from "react";
// import { Page, Grid, Table } from "tabler-react";
// import SiteWrapper from "./SiteWrapper.react";

// class SalaryList extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { data: [] };
//   }

//   loadData() {
//         fetch("http://localhost:8081/api/v1/salary/search/all")
//        //fetch("http://localhost:8082/api/v1/employee/search/all")
//       .then(response => response.json())
//       .then(data => {
//         this.setState({ data });
//       })
//       .catch(err => console.error("Error:", err.toString()));
//   }

//   componentDidMount() {
//     this.loadData();
//   }

//   render() {
//     return (
//       <SiteWrapper>
//         <Page.Card title="Salary List"></Page.Card>

//         <Grid.Col md={6} lg={10} className="align-self-center">
//           <Table>
//             <Table.Header>
//               <Table.ColHeader>Employee ID</Table.ColHeader>
//               <Table.ColHeader>Name</Table.ColHeader>
//               <Table.ColHeader>Annual Package</Table.ColHeader>
//             </Table.Header>

//             <Table.Body>
//               {this.state.data.map((item, i) => (
//                 <Table.Row key={i}>
//                   <Table.Col>{item.id}</Table.Col>
//                   <Table.Col>{item.name}</Table.Col>
//                   <Table.Col>{item.Salary}</Table.Col>
//                 </Table.Row>
//               ))}
//             </Table.Body>
//           </Table>
//         </Grid.Col>
//       </SiteWrapper>
//     );
//   }
// }

// export default SalaryList;
import react, * as React from "react";
import { Page, Grid, Table } from "tabler-react";
import SiteWrapper from "./SiteWrapper.react";

class SalaryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  // loadData() {
  //   fetch("http://localhost:8081/api/v1/salary/search/all")
  //     .then(response => response.json())
  //     .then(data => {
  //       this.setState({ data });
  //     })
  //     .catch(err => console.error("Error:", err.toString()));
  // }
    loadData() {
      fetch("http://localhost:8081/api/v1/salary/search/all")
      .then(response => response.json())
      .then(data => {
      console.log("DEBUG: Salary API Response =", data);
      this.setState({ data });
    })
    .catch(err => console.error("Error:", err.toString()));
}

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <SiteWrapper>
        <Page.Card title="Salary List"></Page.Card>

        <Grid.Col md={6} lg={10} className="align-self-center">
          <Table>
            <Table.Header>
              <Table.ColHeader>Employee ID</Table.ColHeader>
              <Table.ColHeader>Name</Table.ColHeader>
              <Table.ColHeader>Salary</Table.ColHeader>
            </Table.Header>

            <Table.Body>
              {this.state.data.map((item, i) => (
                <Table.Row key={i}>
                  <Table.Col>{item.id}</Table.Col>
                  <Table.Col>{item.name}</Table.Col>
                  <Table.Col style={{ minWidth: "150px" }}>
                  {Number(item.salary).toLocaleString()}
                  </Table.Col>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Grid.Col>
      </SiteWrapper>
    );
  }
}

export default SalaryList;
