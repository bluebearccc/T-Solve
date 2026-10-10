import { http, HttpResponse } from 'msw';
import type { CurrentUser } from '@/shared/api';
import { problem } from '@/shared/api/mocks';
import { getDevRole, setDevRole, type Role } from '@/shared/auth';

const IT = { departmentId: 1, name: 'IT' };
const HR = { departmentId: 2, name: 'HR' };

/** One fixture user per role. The dev role switcher / test helpers pick which one `/me` returns. */
export const MOCK_USERS: Record<Role, CurrentUser> = {
  ADMIN: {
    user: { id: 1, fullName: 'Nguyễn Văn An', email: 'an.nguyen@company.example' },
    role: 'ADMIN',
    projects: [],
    departments: [],
  },
  DEPARTMENT_MANAGER: {
    user: { id: 2, fullName: 'Trần Thị Lan', email: 'lan.tran@company.example' },
    role: 'DEPARTMENT_MANAGER',
    projects: [],
    departments: [IT],
  },
  PROJECT_MANAGER: {
    user: { id: 3, fullName: 'Đỗ Minh Quân', email: 'quan.do@company.example' },
    role: 'PROJECT_MANAGER',
    projects: [
      {
        projectId: 101,
        jiraProjectKey: 'ITSUP',
        departmentId: 1,
        departmentName: 'IT',
        roleInProject: 'PROJECT_MANAGER',
      },
      {
        projectId: 102,
        jiraProjectKey: 'ITNET',
        departmentId: 1,
        departmentName: 'IT',
        roleInProject: 'PROJECT_MANAGER',
      },
      {
        projectId: 201,
        jiraProjectKey: 'HRHELP',
        departmentId: 2,
        departmentName: 'HR',
        roleInProject: 'PROJECT_MANAGER',
      },
    ],
    departments: [IT, HR],
  },
  STAFF: {
    user: { id: 4, fullName: 'Phạm Quốc Bảo', email: 'bao.pham@company.example' },
    role: 'STAFF',
    projects: [
      {
        projectId: 101,
        jiraProjectKey: 'ITSUP',
        departmentId: 1,
        departmentName: 'IT',
        roleInProject: 'MEMBER',
      },
    ],
    departments: [IT],
  },
};

/** `/me` and logout, driven by the dev role (shared/auth/dev-role.ts). */
export const sessionHandlers = [
  http.get('*/api/v1/me', () => {
    const role = getDevRole();
    return role ? HttpResponse.json(MOCK_USERS[role]) : problem(401);
  }),
  http.post('*/api/v1/auth/logout', () => {
    setDevRole(null);
    return new HttpResponse(null, { status: 204 });
  }),
];
