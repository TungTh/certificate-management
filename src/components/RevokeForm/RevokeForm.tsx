import { Form, Input } from 'antd';
import { HomeOutlined, LockOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import React from 'react';

const FormItem = Form.Item;


interface Props {
  onChange: (address: any, reason: any) => void;
}

class RevokeForm extends React.Component<Props> {
  //TODO: handle on change

  // formRef = React.createRef<FormInstance>();
  handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // this.formRef.current.validateFields((err: any, values: { contractAddress: any; reason: any; }) => {
    //   if (!err) {
    //     console.log('Received values of form: ', values);
    //     this.props.onChange(values.contractAddress, values.reason);
    //   }
    // });
  };

  onChange = (changedValues, values) => {
    console.log('Received values of form: ', values);
    this.props.onChange(values.contractAddress, values.reason);
  };

  render() {
    return (
      //TODO: add handle on change onChange={this.handleSubmit}
      <Form className="login-form" onValuesChange={this.onChange}>
        <FormItem 
          name="contractAddress"
          rules={[
          { required: true, message: 'Please input contract address!' },
        ]}>
          <Input
            
            prefix={
              <HomeOutlined
                style={{
                  color: 'rgba(0,0,0,.25)',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              />
            }
            placeholder="Contract Address value"
          />
        </FormItem>
        <FormItem 
          name="reason"
          rules={[
          { required: true, message: 'Please input reason for revoking!' }
        ]}>
          <Input
            prefix={
              <LockOutlined
                style={{
                  color: 'rgba(0,0,0,.25)',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              />
            }
            placeholder="Reason ..."
          />

        </FormItem>
      </Form>
    );
  }
}

const WrappedRevokeForm = RevokeForm;

export default WrappedRevokeForm;
