import { Form, Input } from 'antd';
import { HomeOutlined, LockOutlined } from '@ant-design/icons';
import React from 'react';

const FormItem = Form.Item;

interface Props {
  form: any;
  onChange: (address, reason) => void;
}

class RevokeForm extends React.Component<Props> {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onChange(values.contractAddress, values.reason);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onChange={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('contractAddress', {
            rules: [
              { required: true, message: 'Please input contract address!' },
            ],
          })(
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
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('reason', {
            rules: [
              { required: true, message: 'Please input reason for revoking!' },
            ],
          })(
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
            />,
          )}
        </FormItem>
      </Form>
    );
  }
}

const WrappedRevokeForm = Form.useForm(RevokeForm);

export default WrappedRevokeForm;
