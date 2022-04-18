import * as React from 'react';
import { Node } from '@alilc/lowcode-engine';
import { Dialog, Form, Input } from '@alifd/next';

import { createBlock } from '../apis/block';
import './index.scss';

const FormItem = Form.Item;

interface SaveAsBlockProps {
  node: Node;
}

let dialog;

const SaveAsBlock = (props: SaveAsBlockProps) => {
  const { node } = props;
  const [ src, setSrc ] = React.useState();

  React.useEffect(() => {
    const generateImage = async () => {
      let dom2 = node.getDOMNode();
      console.log('html2canvas: ', html2canvas);
      const canvas = await html2canvas?.(dom2, { scale: 0.5 });
      const dataUrl = canvas.toDataURL();
      setSrc(dataUrl);
    };

    generateImage();
  }, []);

  const save = async (values) => {
    const { name, title } = values;
    const { schema } = node;
    console.log('values: ', values);
    console.log('schema: ', node.schema);

    const res = await createBlock({
      name,
      title,
      schema: JSON.stringify(schema),
      screenshot: src,
    });
    console.log('res: ', res);
    dialog?.hide();
  }

  return <div>
    <Form colon>
      <FormItem
        name="name"
        label="英文名"
        required
        requiredMessage="Please input name!"
      >
        <Input />
      </FormItem>
      <FormItem
        name="title"
        label="中文名"
        required
        requiredMessage="Please input title!"
      >
        <Input />
      </FormItem>
      <FormItem
        name="screenshot"
        label="缩略图"
      >
        <div className='block-screenshot'>

          <img src={src} />
        </div>
        <Input value={src} style={{display: 'none'}}/>
      </FormItem>
      <FormItem label=" " colon={false}>
        <Form.Submit
          type="primary"
          validate
          onClick={save}
          style={{ marginRight: 8 }}
        >
          保存
        </Form.Submit>
        <Form.Reset>重置</Form.Reset>
      </FormItem>
    </Form>
  </div>
}


export default {
  name: 'add',
  content: {
    icon: {
      type: 'add',
      size: 'xs'
    },
    title: '新增',
    action(node: Node) {
      console.log('node: ', node);
      dialog = Dialog.show({
        v2: true,
        title: "保存为区块",
        content: <SaveAsBlock node={node} />,
        footer: false
      });
    },
  },
  important: true,
};