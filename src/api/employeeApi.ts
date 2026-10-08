import { apiClient } from './apiClient';
import { adminRequestConfig } from './adminRequestConfig';
import { unwrapItem, unwrapList } from './unwrap';
import type { Employee, EmployeePayload } from '../types/employee';
import type { Id } from '../types/certificate';

export const employeeApi = {
  async list(): Promise<Employee[]> {
    return unwrapList<Employee>((await apiClient.get('/employee', adminRequestConfig())).data);
  },
  async get(id: Id): Promise<Employee> {
    return unwrapItem<Employee>((await apiClient.get(`/employee/${id}`, adminRequestConfig())).data);
  },
  async create(payload: EmployeePayload): Promise<Employee> {
    return unwrapItem<Employee>((await apiClient.post('/employee', payload, adminRequestConfig())).data);
  },
  async update(id: Id, payload: Partial<EmployeePayload>): Promise<Employee> {
    return unwrapItem<Employee>((await apiClient.patch(`/employee/${id}`, payload, adminRequestConfig())).data);
  },
  async remove(id: Id): Promise<void> {
    await apiClient.delete(`/employee/${id}`, adminRequestConfig());
  },
};
