// CRM route registry - maps feature areas to file paths
export const crmRoutes = {
  auth: {
    login: "/login",
    register: "/register",
    api: "/api/auth/[...nextauth]",
  },
  dashboard: {
    index: "/dashboard",
  },
  contacts: {
    list: "/contacts",
    detail: "/contacts/[id]",
    api: "/api/contacts",
    apiDetail: "/api/contacts/[id]",
  },
  leads: {
    list: "/leads",
    api: "/api/leads",
  },
  deals: {
    list: "/deals",
    api: "/api/deals",
  },
  activities: "/activities",
  settings: "/settings",
  user: "/api/user",
} as const;
