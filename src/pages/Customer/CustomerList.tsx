import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { AxiosResponse } from 'axios'
import { Table } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteCustomer, getCustomers } from '../../api/customer/requests'
import { useModal } from '../../hooks'
import {
  GetCustomerReq,
  GetCustomersRes,
  DeleteCustomerRes,
} from '../../api/customer'
import { AppErrorResponse, Customer } from '../../common/types'
import { customerListColumns } from './config'
import { useNotificationContext } from '../../contexts/notification/notificationContext'
import { APP_PATHS } from '../../utils/paths'
import { InputSearch } from '../../components/Input'

export const CustomerList = () => {
  const { activateModal } = useModal()
  const { notification } = useNotificationContext()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const currentId = useRef('')

  const [query, setQuery] = useState<GetCustomerReq>({
    limit: 10,
    page: 1,
  })
  const {
    data: customerResponse,
    isError: isFetchingCustomerErr,
    isPending: isFetchingCustomers,
    error: customerListError,
  } = useQuery<AxiosResponse<GetCustomersRes>, AppErrorResponse>({
    queryKey: ['get-customers', query.limit, query.page, query.search],
    queryFn: () => getCustomers(query),
  })
  const customerList = customerResponse?.data.data

  const { mutate: deleteCustomerMutate, isPending: isDeleting } = useMutation<
    AxiosResponse<DeleteCustomerRes>,
    DeleteCustomerRes,
    string
  >({
    mutationKey: [`delete-customer-${currentId.current}`],
    mutationFn: deleteCustomer,
    onError: (err) =>
      activateModal('danger', err.msg || 'Deleting customer failed'),
    onSuccess: (response) => {
      notification('success', {
        message: response.data.msg,
        duration: 1,
        onClose: () => {
          queryClient.invalidateQueries({
            queryKey: ['get-customers', query.limit, query.page, query.search],
          })
        },
      })
    },
  })

  useEffect(() => {
    if (isFetchingCustomerErr) {
      activateModal(
        'danger',
        customerListError.response?.data.message ||
          customerListError.response?.data.error ||
          'Fetching customers failed'
      )
    }
  }, [isFetchingCustomerErr, customerListError])

  const handleEyeClick = (customerId: string) =>
    navigate(APP_PATHS.customerProfile, {
      state: { customerId },
    })

  return (
    <>
      <InputSearch
        placeholder="Search by name..."
        onSearch={(value) =>
          setQuery((prev) => ({
            ...prev,
            search: value || undefined,
          }))
        }
        className="my-5"
      />
      <Table<Customer>
        loading={isFetchingCustomers}
        dataSource={customerList}
        columns={customerListColumns({
          onDelete: deleteCustomerMutate,
          isDeleting,
          currentId: currentId.current,
          onEyeClick: handleEyeClick,
        })}
        rowKey={({ _id }) => _id}
        onRow={({ _id }) => ({
          onClick: () => {
            currentId.current = _id
          },
        })}
        pagination={{
          total: customerResponse?.data.totalUsers,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setQuery({
              page,
              limit: pageSize,
            })
          },
        }}
      />
    </>
  )
}
