import React, { useState } from "react";
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Button,
  Space,
  Select,
  InputNumber,
  message,
} from "antd";
import axios from "axios";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import "../App.css";
import "antd/dist/antd.css";

const { Option } = Select;

const PatientInformation = () => {
  const [form] = Form.useForm();

  const [geneChanges, setGeneChanges] = useState(null);
  const [personalHistory, setPersonalHistory] = useState(null);
  const [familyHistory, setFamilyHistory] = useState(null);
  const key = "updatable";

  function addData(data) {
    console.log(data);
    message.loading({ content: "Loading...", key });
    axios
      .post("http://localhost:80/add", data, {
        "content-type": "application/json",
      })
      .then((res) => {
        if (res["status"] === 200) {
          // openNotification();
          message.success({
            content: "Data append successful",
            key,
            duration: 4,
          });
        }
        console.log(res);
      });
  }
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  // function openNotification() {
  //   notification.open({
  //     message: "Data append successful",
  //     description:
  //       "The form data has been added to the historical patient database.",
  //     duration: 4,
  //   });
  // }

  const onFinish = (values) => {
    const {
      geneTest,
      personalHistory,
      familyHistory,
      hispanic,
      race,
      jewDescent,
      label,
    } = values;
    console.log(values);

    let personalArr = [];
    let relArr = [];
    //   let geneArr = []
    let raceStr;

    // if (geneTest === true) {
    //   for (let i = 0; i < values["geneName"].length; i++) {
    //     personalArr.push(values["geneName"]);
    //   }
    // }
    if (personalHistory === true) {
      for (let i = 0; i < values["personalCancer"].length; i++) {
        personalArr.push(values["personalCancer"][i]);
      }
    }
    if (familyHistory === true) {
      for (let i = 0; i < values["familyCancer"].length; i++) {
        relArr.push(values["familyCancer"][i]);
      }
    }

    if (jewDescent === true) {
      raceStr = "Jewish";
    } else if (hispanic === true) {
      raceStr = "Hispanic";
    } else {
      // raceStr = race.join(" ");
      raceStr = race[0];
    }

    const parsed = {
      // gene: geneArr,
      pathogenic: geneTest,
      personalHistory: personalArr,
      relHistory: relArr,
      race: raceStr,
      label: label,
    };
    addData(parsed);
  };

  const onReset = () => {
    setGeneChanges(null);
    setPersonalHistory(null);
    setFamilyHistory(null);
    form.resetFields();
  };

  return (
    <div className="enterPatientForm">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item onClick={onReset}>
          <Button danger>Reset</Button>
        </Form.Item>
        <Form.Item
          required
          label="Ashkenazi Jewish descent?"
          name="jewDescent"
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group>
            <Radio style={radioStyle} value={true}>
              Yes
            </Radio>
            <Radio style={radioStyle} value={false}>
              No
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          required
          label="Race"
          name="race"
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Checkbox.Group>
            <Checkbox value="Native American">
              American Indian or Alaska Native
            </Checkbox>
            <Checkbox value="Asian">Asian</Checkbox>
            <Checkbox value="Black">Black or African American</Checkbox>
            <Checkbox value="White">White</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          required
          label="Hispanic?"
          name="hispanic"
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group>
            <Radio style={radioStyle} value={true}>
              Yes
            </Radio>
            <Radio style={radioStyle} value={false}>
              No
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          required
          label="Does the patient have any gene mutations?"
          rules={[{ required: true, message: "Empty field" }]}
          name="geneTest"
        >
          <Radio.Group
            value={geneChanges === null ? "" : geneChanges}
            onChange={({ target }) => setGeneChanges(target.value)}
          >
            <Radio style={radioStyle} value={true}>
              Yes
            </Radio>
            <Radio style={radioStyle} value={false}>
              No
            </Radio>
          </Radio.Group>
        </Form.Item>
        {geneChanges === true ? (
          <Form.Item
            required
            label="Please provide the gene names, entered individually."
            name="geneName"
          >
            <Form.List name="geneName" initialValue={[{ geneName: "" }]}>
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map((field) => (
                      <Space
                        key={field.key}
                        style={{ display: "flex" }}
                        align="baseline"
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, "geneName"]}
                          fieldKey={[field.fieldKey, "geneName"]}
                          rules={[{ required: true, message: "Empty field" }]}
                        >
                          <Input />
                        </Form.Item>
                        {field.name !== 0 ? (
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add gene
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
          </Form.Item>
        ) : null}
        <Form.Item
          required
          name="personalHistory"
          label="Have the patient ever been diagnosed with cancer?"
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group
            value={personalHistory === null ? "" : personalHistory}
            onChange={({ target }) => setPersonalHistory(target.value)}
          >
            <Radio style={radioStyle} value={true}>
              Yes, the patient has been diagnosed with cancer.
            </Radio>
            <Radio style={radioStyle} value={false}>
              No, the patient has never been diagnosed with cancer.
            </Radio>
          </Radio.Group>
        </Form.Item>
        {personalHistory === true ? (
          <Form.Item
            required
            label="Please provide the type of cancer and age of diagnosis. If the patient has had multiple cancers, separate each cancer/age using a comma."
            name="personalCancer"
          >
            <Form.List
              name="personalCancer"
              initialValue={[{ type: "", age: "" }]}
            >
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map((field) => (
                      <Space
                        key={field.key}
                        style={{ display: "flex" }}
                        align="baseline"
                      >
                        <Form.Item
                          {...field}
                          required
                          name={[field.name, "type"]}
                          label="Cancer type"
                          fieldKey={[field.fieldKey, "type"]}
                          rules={[{ required: true, message: "Empty field" }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          required
                          name={[field.name, "age"]}
                          label="Age at diagnosis"
                          fieldKey={[field.fieldKey, "age"]}
                          rules={[{ required: true, message: "Empty field" }]}
                        >
                          <InputNumber />
                        </Form.Item>
                        {field.name !== 0 ? (
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add cancer
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
          </Form.Item>
        ) : null}
        <Form.Item
          required
          name="familyHistory"
          label="Patient family history"
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group
            value={familyHistory === null ? "" : familyHistory}
            onChange={({ target }) => setFamilyHistory(target.value)}
          >
            <Radio style={radioStyle} value={true}>
              Yes, the patient has relative(s) who have been diagnosed with
              cancer.
            </Radio>
            <Radio style={radioStyle} value={false}>
              No, the patient does not have relative(s) who have been diagnosed
              with cancer.
            </Radio>
          </Radio.Group>
        </Form.Item>
        {familyHistory === true ? (
          <Form.Item
            required
            label="Please provide the type of cancer and age of diagnosis for each patient's relative that has been diagnosed with cancer. If someone has had multiple cancers, separate each cancer/age using a comma."
            name="familyCancer"
          >
            <Form.List
              name="familyCancer"
              initialValue={[{ relationship: "", type: "", age: "" }]}
            >
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map((field) => (
                      <Space
                        key={field.key}
                        style={{ display: "flex" }}
                        align="baseline"
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, "relationship"]}
                          label="Relationship to patient"
                          fieldKey={[field.fieldKey, "relationship"]}
                          rules={[{ required: true, message: "Empty field" }]}
                        >
                          <Select>
                            <Option value="father">Father</Option>
                            <Option value="mother">Mother</Option>
                            <Option value="grandfather">Grandfather</Option>
                            <Option value="grandmother">Grandmother</Option>
                            <Option value="uncle">Uncle</Option>
                            <Option value="aunt">Aunt</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "type"]}
                          label="Cancer type"
                          fieldKey={[field.fieldKey, "type"]}
                          rules={[{ required: false, message: "Empty field" }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "age"]}
                          label="Age at diagnosis"
                          fieldKey={[field.fieldKey, "age"]}
                          rules={[{ required: false, message: "Empty field" }]}
                        >
                          <Input />
                        </Form.Item>
                        {field.name !== 0 ? (
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add relative
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
          </Form.Item>
        ) : null}
        <Form.Item
          required
          label="Please provide the risk for this patient."
          name="label"
        >
          <Select>
            <Option value="strong_personal">Strong personal</Option>
            <Option value="strong_family">Strong family</Option>
            <Option value="not_strong">Not strong/some</Option>
            <Option value="none">No relevant family history</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PatientInformation;
