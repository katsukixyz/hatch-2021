import React, { useState } from "react";
import "./App.css";
import PatientPrediction from "./components/PatientPrediction";
import PatientInformation from "./components/PatientInformation";
import PatientDatabase from "./components/PatientDatabase";
import { Tabs, Layout } from "antd";
import logo from "./hatch2021.png";
import "antd/dist/antd.css";

const { TabPane } = Tabs;
const { Header, Content, Footer } = Layout;

export default function App() {
  const [tableData, setTableData] = useState([]);
  return (
    <div className="App">
      <div className="tabs">
        <Layout>
          <Header>
            <img style={{ width: "40px", height: "40px" }} src={logo} />
          </Header>
          <Content style={{ padding: "50px 50px 0px 50px" }}>
            <Tabs
              style={{ padding: "24px", background: "white" }}
              defaultActiveKey="1"
              onChange={null}
              centered
            >
              <TabPane tab="Predict Patient Cancer Risk" key="1">
                <PatientPrediction />
              </TabPane>
              <TabPane tab="Enter Patient Information" key="2">
                <PatientInformation />
              </TabPane>
              <TabPane tab="View Database" key="3">
                <PatientDatabase
                  tableData={tableData}
                  setTableData={setTableData}
                />
              </TabPane>
            </Tabs>
          </Content>
          <Footer style={{ textAlign: "center" }}>ForensX</Footer>
        </Layout>
      </div>
    </div>
  );
}
