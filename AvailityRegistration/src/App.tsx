import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Table,
  message,
  Space,
  Row,
  Col
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
interface DataType {
  id: string;
  first_name: string;
  last_name: string;
  npi_number: string;
  business_address: string;
  telephone: string;
  email: string;
}

const App: React.FC = () => {

  const columns: ColumnsType<DataType> = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'NPI Number',
      dataIndex: 'npi_number',
      key: 'npi_number',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Business Address',
      dataIndex: 'business_address',
      key: 'business_address',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Telephone Number',
      dataIndex: 'telephone',
      key: 'telephone',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (row) => <Space size="middle"><a onClick={e => onEdit(row.id)}>Edit</a><a onClick={e => onDelete(row.id)}>Delete</a></Space>,
    },
  ];

  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>();
  const [model, setModel] = useState<DataType>({} as DataType);
  const [reloadData, setReloadData] = useState<number>(0);
  const onFormLayoutChange = (values: any) => {
  };

  useEffect(() => {
    const dataStr = localStorage.getItem(`${window.location.host}-demo-data-list`);
    if (dataStr && dataStr !== '') {
      const datas = JSON.parse(dataStr);
      setData(datas);
    }
  }, [reloadData]);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 14 },
  };

  const onFinish = (values: any) => {
    if (values.id && values.id !== '') {
      const datas = getDatas();
      const index = datas.findIndex((p: any) => p.id == values.id);
      datas[index] = values;
      setDatas(datas);
      setReloadData(Date.now());
      message.success('Submit successfuly');
      form.resetFields();
    }
    else {
      values.id = Date.now().toString();
      const datas = getDatas();
      datas.push(values);
      setDatas(datas);
      setReloadData(Date.now());
      message.success('Submit successfuly');
      form.resetFields();
    }
  };

  const onEdit = (id: any) => {
    const datas = getDatas();
    const model = datas.find((p: any) => p.id == id);
    form.setFieldsValue(model);
  }

  const onDelete = (id: any) => {
    const datas = getDatas();
    const dataFilters = datas.filter((p: any) => p.id != id);
    setDatas(dataFilters);
    setReloadData(Date.now());
  }

  const getDatas = () => {
    const dataStr = localStorage.getItem(`${window.location.host}-demo-data-list`);
    if (dataStr && dataStr !== '') {
      return JSON.parse(dataStr);
    }
    return [];
  }

  const setDatas = (datas: any) => {
    const dataStr = JSON.stringify(datas);
    localStorage.setItem(`${window.location.host}-demo-data-list`, dataStr);
  }

  return (
    <>
      <Form
        {...layout}
        onValuesChange={onFormLayoutChange}
        disabled={false}
        style={{ marginTop: 40 }}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        initialValues={model}
      >
        <Form.Item name="id" label="id" hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item name="first_name" label="First Name"
          rules={[
            {
              required: true,
              message: 'Please input your first name!',
            },
            {
              max: 125
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="last_name" label="Last Name"
          rules={[
            {
              required: true,
              message: 'Please input your last name!',
            },
            {
              max: 125
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="npi_number" label="NPI Number"
          rules={[
            {
              pattern: /^\d{10}$/,
              message: "NPI Number should contain just number and should  10-digit number",
            },
            {
              required: true,
              message: 'Please input your NPI number!',
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="business_address" label="Business Address"
          rules={[
            {
              required: true,
              message: 'Please input your business address!',
            },
            {
              max: 125
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="telephone" label="Telephone Number"
          rules={[
            {
              pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
              message: "The input is not valid telephone number",
            },
            {
              required: true,
              message: 'Please input your telephone number!',
            },
            {
              max: 125
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email Address"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
            {
              max: 125
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item shouldUpdate {...tailLayout}>
          {() => (
            <Space size="middle">
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(['first_name', 'last_name', 'npi_number', 'business_address', 'telephone', 'email'], true) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
                }
              >
                Ok
              </Button>
              <Button
                type="default"
                onClick={e => form.resetFields()}
              >
                Cancel
              </Button>
            </Space>
          )}

        </Form.Item>
      </Form>
      <hr />
      <Row>
        <Col span={18} offset={2}>
          <Table columns={columns} dataSource={data} />
        </Col>
      </Row>

    </>
  );
}

export default App;
