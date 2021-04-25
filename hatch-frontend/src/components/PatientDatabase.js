import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import axios from "axios";
import "../App.css";
import "antd/dist/antd.css";

const PatientDatabase = ({ tableData, setTableData }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  function getData() {
    setLoading(true);
    axios.get("http://localhost:80/data").then((res) => {
      let { cols, data } = res.data;
      // columns
      let formattedCol = [];
      for (let i = 0; i < cols.length; i++) {
        if (cols[i] === "history_class") {
          formattedCol.push({
            title: cols[i],
            dataIndex: cols[i],
            key: cols[i],
            filters: [
              { text: "strong_personal", value: "strong_personal" },
              { text: "strong_family", value: "strong_family" },
              { text: "not_strong", value: "not_strong" },
              { text: "none", value: "none" },
            ],
            filterMultiple: true,
            onFilter: (value, record) =>
              record["history_class"].indexOf(value) === 0,
          });
        } else if (cols[i] === "Pathogenic?") {
          formattedCol.push({
            title: cols[i],
            dataIndex: cols[i],
            key: cols[i],
            filters: [
              { text: "true", value: "true" },
              { text: "false", value: "false" },
            ],
            filterMultiple: false,
            onFilter: (value, record) =>
              record["Pathogenic?"].indexOf(value) === 0,
          });
        } else if (cols[i] === "ethnicity") {
          formattedCol.push({
            title: cols[i],
            dataIndex: cols[i],
            key: cols[i],
            filters: [
              { text: "White", value: "White" },
              { text: "Asian", value: "Asian" },
              { text: "Black", value: "Black" },
              { text: "Jewish", value: "Jewish" },
              { text: "Hispanic", value: "Hispanic" },
              { text: "Middle Eastern", value: "Middle Eastern" },
            ],
            filterMultiple: true,
            onFilter: (value, record) =>
              record["ethnicity"].indexOf(value) === 0,
          });
        } else {
          formattedCol.push({
            title: cols[i],
            dataIndex: cols[i],
            key: cols[i],
          });
        }
      }
      setColumns(formattedCol);

      //data
      let allData = [];
      let parsedData = JSON.parse(data);
      for (let i = 0; i < parsedData.length; i++) {
        allData.push({
          ...parsedData[i],
          key: i,
        });
      }
      setTableData(allData);
      setLoading(false);
    });
  }

  useEffect(() => {
    setLoading(true);
    getData();
  }, [getData]);
  return (
    <div className="tableElement">
      <Button loading={loading} onClick={() => getData()}>
        Refresh
      </Button>
      <Table
        loading={loading}
        scroll={{ x: true }}
        columns={columns ? columns : null}
        dataSource={tableData ? tableData : null}
      ></Table>
    </div>
  );
};

export default PatientDatabase;
