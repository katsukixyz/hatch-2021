import React, { useState } from "react";
import {
  Tabs,
  Form,
  Input,
  Radio,
  Checkbox,
  Button,
  Space,
  Select,
  InputNumber,
  Row,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import "../App.css";
import "antd/dist/antd.css";

const { Option } = Select;

const PatientPrediction = () => {
  const [form] = Form.useForm();

  const [geneChanges, setGeneChanges] = useState(null);
  const [parentsHistory, setParentsHistory] = useState(null);
  const [motherParentsHistory, setMotherParentsHistory] = useState(null);
  const [fatherParentsHistory, setFatherParentsHistory] = useState(null);
  const [auntUncleHistory, setAuntUncleHistory] = useState(null);

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };
  const checkboxStyle = {
    // display: "block",
    // marginLeft: 0,
    // height: "30px",
    // lineHeight: "30px",
  };

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div className="historyForm">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          required
          label="Have you mapped your family's health history back one or two generations?"
          name="healthHistory"
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group>
            <Radio style={radioStyle} value="yes">
              Yes, I've researched my family's health and have the information
              available.
            </Radio>
            <Radio style={radioStyle} value="unsure">
              I'm not sure how accurate my family's health information is but
              I'll do the best I can.
            </Radio>
            <Radio style={radioStyle} value="no">
              No, I haven't been able to do the research, so I'll be using my
              best recollections.
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          required
          label="Are you located in the United States?"
          name="usLocation"
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group>
            <Radio style={radioStyle} value="yes">
              Yes
            </Radio>
            <Radio style={radioStyle} value="no">
              No
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          required
          label="Are you of Ashkenazi Jewish descent?"
          name="jewDescent"
        >
          <Radio.Group>
            <Radio style={radioStyle} value="yes">
              Yes
            </Radio>
            <Radio style={radioStyle} value="no">
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
            <Checkbox style={checkboxStyle} value="nativeAmerican">
              American Indian or Alaska Native
            </Checkbox>
            <Checkbox style={checkboxStyle} value="asian">
              Asian
            </Checkbox>
            <Checkbox style={checkboxStyle} value="black">
              Black or African American
            </Checkbox>
            <Checkbox style={checkboxStyle} value="white">
              White
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          required
          label="Are you of Hispanic, Latino, or Spanish origin?"
          name="hispanic"
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group>
            <Radio style={radioStyle} value="yes">
              Yes
            </Radio>
            <Radio style={radioStyle} value="no">
              No
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          required
          label="Have you been tested for gene changes?"
          rules={[{ required: true, message: "Empty field" }]}
          name="geneTest"
        >
          <Radio.Group
            value={geneChanges === null ? "" : geneChanges}
            onChange={({ target }) => setGeneChanges(target.value)}
          >
            <Radio style={radioStyle} value={true}>
              Yes, I have been. I'll list the gene changes identified below.
            </Radio>
            <Radio style={radioStyle} value={false}>
              No, I've never had genetic tests before.
            </Radio>
          </Radio.Group>
        </Form.Item>
        {geneChanges === true ? (
          <Form.Item
            required
            label="Please provide the gene names, entered individually."
            name="gene"
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
          name="parentsHistory"
          label="Has your mother or father been diagnosed with cancer? Only 'blood' relatives need to be considered for this survey."
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group
            value={parentsHistory === null ? "" : parentsHistory}
            onChange={({ target }) => setParentsHistory(target.value)}
          >
            <Radio style={radioStyle} value={true}>
              Yes, one or both of my parents have been diagnosed with cancer.
            </Radio>
            <Radio style={radioStyle} value={false}>
              No, neither of my parents have been diagnosed with cancer.
            </Radio>
            <Radio style={radioStyle} value="unsure">
              I don't know or remember.
            </Radio>
          </Radio.Group>
        </Form.Item>
        {parentsHistory === true ? (
          <Form.Item
            required
            label="Please provide the type of cancer and age of diagnosis for each parent that has been diagnosed with cancer. If someone has had multiple cancers, separate each cancer/age using a comma."
            name="parentsGene"
          >
            <Form.List
              name="parentsGene"
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
                          label="Relationship to you"
                          fieldKey={[field.fieldKey, "relationship"]}
                          rules={[{ required: true, message: "Empty field" }]}
                        >
                          <Select>
                            <Option value="father">Father</Option>
                            <Option value="mother">Mother</Option>
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
                        Add parent
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
          name="motherParents"
          label="Were your mother's parents ever diagnosed with cancer? Only 'blood' relatives need to be considered for this survey."
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group
            value={motherParentsHistory === null ? "" : motherParentsHistory}
            onChange={({ target }) => setMotherParentsHistory(target.value)}
          >
            <Radio style={radioStyle} value={true}>
              Yes, one or both of my mother's parents have been diagnosed with
              cancer.
            </Radio>
            <Radio style={radioStyle} value={false}>
              No, neither of my mother's parents have been diagnosed with
              cancer.
            </Radio>
            <Radio style={radioStyle} value="unsure">
              I don't know or remember.
            </Radio>
          </Radio.Group>
        </Form.Item>
        {motherParentsHistory === true ? (
          <Form.Item
            required
            name="motherParentsGene"
            label="Please provide the type of cancer and age of diagnosis for each maternal grandparent that has been diagnosed with cancer. If someone has had multiple cancers, separate each cancer/age using a comma under the same relationship."
          >
            <Form.List
              name="motherParentsGene"
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
                          label="Relationship to you"
                          fieldKey={[field.fieldKey, "relationship"]}
                          rules={[{ required: true, message: "Empty field" }]}
                        >
                          <Select dropdownMatchSelectWidth={false}>
                            <Option value="grandfather">
                              Maternal grandfather
                            </Option>
                            <Option value="grandmother">
                              Maternal grandmother
                            </Option>
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
                        Add maternal grandparent
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
          name="fatherParents"
          label="Were your father's parents ever diagnosed with cancer? Only 'blood' relatives need to be considered for this survey."
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group
            value={fatherParentsHistory === null ? "" : fatherParentsHistory}
            onChange={({ target }) => setFatherParentsHistory(target.value)}
          >
            <Radio style={radioStyle} value={true}>
              Yes, one or both of my father's parents have been diagnosed with
              cancer.
            </Radio>
            <Radio style={radioStyle} value={false}>
              No, neither of my father's parents have been diagnosed with
              cancer.
            </Radio>
            <Radio style={radioStyle} value="unsure">
              I don't know or remember.
            </Radio>
          </Radio.Group>
        </Form.Item>
        {fatherParentsHistory === true ? (
          <Form.Item
            required
            name="fatherParentsGene"
            label="Please provide the type of cancer and age of diagnosis for each paternal grandparent that has been diagnosed with cancer. If someone has had multiple cancers, separate each cancer/age using a comma."
          >
            <Form.List
              name="fatherParentsGene"
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
                          label="Relationship to you"
                          fieldKey={[field.fieldKey, "relationship"]}
                          rules={[{ required: true, message: "Empty field" }]}
                        >
                          <Select dropdownMatchSelectWidth={false}>
                            <Option value="grandfather">
                              Paternal grandfather
                            </Option>
                            <Option value="grandmother">
                              Paternal grandmother
                            </Option>
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
                        Add paternal grandparent
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
          name="auntsUncles"
          label="Were your parents' brothers or sisters ever diagnosed with cancer? Only 'blood' relatives need to be considered for this survey."
          rules={[{ required: true, message: "Empty field" }]}
        >
          <Radio.Group
            value={auntUncleHistory === null ? "" : auntUncleHistory}
            onChange={({ target }) => setAuntUncleHistory(target.value)}
          >
            <Radio style={radioStyle} value={true}>
              Yes, my aunt(s) or uncle(s) were diagnosed with cancer.
            </Radio>
            <Radio style={radioStyle} value={false}>
              No, my aunt(s) or uncle(s) have never been diagnosed with cancer.
            </Radio>
            <Radio style={radioStyle} value="unsure">
              I don't know or remember.
            </Radio>
          </Radio.Group>
        </Form.Item>
        {auntUncleHistory === true ? (
          <Form.Item
            required
            name="auntsUnclesGene"
            label="Please provide the type of cancer and age of diagnosis for each aunt/uncle that has been diagnosed with cancer. If someone has had multiple cancers, separate each cancer/age using a comma."
          >
            <Form.List
              name="auntsUnclesGene"
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
                          label="Relationship to you"
                          fieldKey={[field.fieldKey, "relationship"]}
                          rules={[{ required: true, message: "Empty field" }]}
                        >
                          <Select>
                            <Option value="aunt">Aunt</Option>
                            <Option value="uncle">Uncle</Option>
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
                        Add aunt/uncle
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
          </Form.Item>
        ) : null}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PatientPrediction;
