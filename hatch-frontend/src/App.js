import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import PatientPrediction from "./components/PatientPrediction";
import { Tabs, Form, Input, Radio, Checkbox, Button, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const { TabPane } = Tabs;

export default function App() {
  return (
    <div className="App">
      <div className="tabs">
        <Tabs defaultActiveKey="1" onChange={null} centered>
          <TabPane tab="Predict Patient Cancer Risk" key="1">
            <PatientPrediction />
          </TabPane>
          <TabPane tab="Enter Patient Information" key="2">
            joe 2
          </TabPane>
          <TabPane tab="View Database" key="3">
            joe 2
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
