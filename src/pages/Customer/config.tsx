import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Col, Popconfirm, Row, Space, TableProps } from 'antd'
import { Customer } from '../../common/types'
import { formatToDDMMMYYYY } from '../../utils/date'
import { CustomerListColumns } from './types'
import { Avatar } from '../../components/Avatar'

export const customerListColumns = ({
  currentId,
  isDeleting,
  onDelete,
  onEyeClick,
}: CustomerListColumns): TableProps<Customer>['columns'] => [
  {
    dataIndex: '_id',
    key: 'id',
    title: 'ID',
  },
  {
    dataIndex: 'username',
    key: 'name',
    title: 'Name',
    render: (username: Customer['username'], { email, image }) => (
      <Row align="middle">
        <Col span={4}>
          <Avatar src={image?.url} size={50} />
        </Col>
        <Col>
          <Row className="font-semibold text-brand-400">{username}</Row>
          <Row className="text-neutral-300">{email}</Row>
        </Col>
      </Row>
    ),
  },
  {
    dataIndex: 'phone',
    key: 'phone',
    title: 'Phone Number',
  },
  {
    dataIndex: 'created_at',
    key: 'created_at',
    title: 'Created',
    render: (createdAt: Customer['created_at']) => formatToDDMMMYYYY(createdAt),
  },
  {
    key: 'action',
    title: 'Actions',
    render: (_, { _id }) => (
      <Space>
        <Popconfirm title="Are You Sure?" onConfirm={() => onDelete(_id)}>
          <Button
            icon={<DeleteOutlined />}
            key={_id}
            loading={isDeleting && _id === currentId}
          />
        </Popconfirm>
        <Button icon={<EyeOutlined />} onClick={() => onEyeClick(_id)} />
      </Space>
    ),
  },
]
