import axiosInstance from '../../utils/axios'
import { DeleteCategoryRes, GetCategoriesReq, GetCategoriesRes } from './types'
import { DefaultApiResponse } from '../../common/types'

export const getCategories = async (
  reqBody: GetCategoriesReq
): Promise<GetCategoriesRes> => {
  const request = await axiosInstance.get(
    '/Admin/listCategoriesWithItemsCount',
    { params: reqBody }
  )
  return request
}

export const deleteCategory = async (
  id: string
): Promise<DeleteCategoryRes> => {
  const request = await axiosInstance.delete(`/Admin/deleteCategory/${id}`)
  return request
}

export const createCategory = async (
  reqBody: FormData
): Promise<DefaultApiResponse> => {
  const request = await axiosInstance.post('/Admin/createCategory', reqBody, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return request
}
