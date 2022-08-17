import React, { useEffect, useState } from "react";
import "./styles.css";
import { Table, Card } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { io } from "socket.io-client";
import moment from "moment";
function SingleGrid() {
  const [tabs, setTabs] = useState([
    "RR/BF",
    "Call/Put",
    "Vol Curve",
    "Vol Smile",
    "Heatmaps",
  ]);
  const [selected, setSelected] = useState("RR/BF");
  const [rrTableData, setRRTableData] = useState([]);
  const [cellTableData, setCellTableData] = useState([]);
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    //const socket = io("ws://socket-test.ngminds.com");
    const socket = io("http://localhost:8080");
    socket.io.engine.off("package");
    setTimeout(() => {
      socket.io.engine.on("packet", (packetdata) => {
        let x = JSON.parse(packetdata.data.substring(1));
        console.log(counter);
        setCounter((prev) => {
          if (prev === 1000) {
            return 0;
          } else {
            if (x[0] === "RR/BF" && selected === "RR/BF") {
              setRRTableData(x[1]);
            } else if (x[0] === "Call/Put" && selected === "Call/Put")
              setCellTableData(x[1]);
            return prev + 1;
          }
        });
      });
    }, 1000);
  }, [selected]);

  return (
    <body>
      <div className="main">
        <Card className="main-div">
          <div className="header">
            <MDBIcon
              fas
              icon="angle-double-right"
              style={{ marginTop: "5px" }}
            />
            <label>Single Currency Grid</label>
          </div>
          <Table striped bordered hover className="table-header">
            <thead>
              <tr>
                {tabs?.map((tab, index) => {
                  return (
                    <th
                      className="p-2"
                      style={{
                        backgroundColor:
                          selected == tab ? "rgb(98, 97, 160)" : "",
                      }}
                      onClick={() => {
                        setSelected(tab);
                      }}
                    >
                      {tab}
                    </th>
                  );
                })}
              </tr>
            </thead>
          </Table>
          <div>
            <Table bordered className="table-header" responsive="sm">
              <thead style={{ borderTop: "hidden", borderLeft: "hidden" }}>
                <tr className="table-content">
                  <th></th>
                  <th></th>
                  <th>Exp Date</th>
                  <th>ATM</th>
                  <th>25d R/R</th>
                  <th>10d R/R</th>
                  <th>25d B/F</th>
                  <th>10d B/F </th>
                </tr>
              </thead>
              <tbody style={{ borderBottom: "hidden", borderLeft: "hidden" }}>
                {selected == "RR/BF"
                  ? rrTableData?.map((data, i) => {
                      return (
                        <tr>
                          <td></td>
                          <td>
                            {moment
                              .utc(data.time)
                              .local()
                              .startOf("seconds")
                              .fromNow()
                              .replace("ago", "")}
                          </td>
                          <td>{moment(data.exp).format("DD MMMM , YYYY")}</td>
                          <td>{data.atm}</td>
                          <td>{data.rr_25}</td>
                          <td>{data.rr_10}</td>
                          <td>{data.bf_25}</td>
                          <td>{data.bf_10}</td>
                        </tr>
                      );
                    })
                  : selected == "Call/Put"
                  ? cellTableData?.map((data, i) => {
                      return (
                        <tr>
                          <td></td>
                          <td>
                            {moment
                              .utc(data.time)
                              .local()
                              .startOf("seconds")
                              .fromNow()
                              .replace("ago", "")}
                          </td>
                          <td>{moment(data.exp).format("DD MMMM , YYYY")}</td>
                          <td>{data.atm}</td>
                          <td>{data.rr_25}</td>
                          <td>{data.rr_10}</td>
                          <td>{data.bf_25}</td>
                          <td>{data.bf_10}</td>
                        </tr>
                      );
                    })
                  : ""}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </body>
  );
}
export default SingleGrid;
