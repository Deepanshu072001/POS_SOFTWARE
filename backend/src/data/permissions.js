const permissions = [
  // AUTH
  { module: "AUTH", action: "create", description: "Create users" },
  { module: "AUTH", action: "read", description: "View users" },
  { module: "AUTH", action: "update", description: "Update users" },
  { module: "AUTH", action: "delete", description: "Delete users" },

  // DASHBOARD
  { module: "DASHBOARD", action: "read", description: "View dashboard" },

  // BRANCH
  { module: "BRANCH", action: "create", description: "Create branches" },
  { module: "BRANCH", action: "read", description: "View branches" },
  { module: "BRANCH", action: "update", description: "Update branches" },
  { module: "BRANCH", action: "delete", description: "Delete branches" },

  // MENU
  { module: "MENU", action: "create", description: "Create menu items" },
  { module: "MENU", action: "read", description: "View menu items" },
  { module: "MENU", action: "update", description: "Update menu items" },
  { module: "MENU", action: "delete", description: "Delete menu items" },

  // CATEGORY
  { module: "CATEGORY", action: "create", description: "Create categories" },
  { module: "CATEGORY", action: "read", description: "View categories" },
  { module: "CATEGORY", action: "update", description: "Update categories" },
  { module: "CATEGORY", action: "delete", description: "Delete categories" },

  // ORDER
  { module: "ORDER", action: "create", description: "Create orders" },
  { module: "ORDER", action: "read", description: "View orders" },
  { module: "ORDER", action: "update", description: "Update orders" },
  { module: "ORDER", action: "delete", description: "Cancel orders" },

  // PAYMENT
  { module: "PAYMENT", action: "create", description: "Create payments" },
  { module: "PAYMENT", action: "read", description: "View payments" },
  { module: "PAYMENT", action: "refund", description: "Refund payments" },

  // CUSTOMER
  { module: "CUSTOMER", action: "create", description: "Create customers" },
  { module: "CUSTOMER", action: "read", description: "View customers" },
  { module: "CUSTOMER", action: "update", description: "Update customers" },
  { module: "CUSTOMER", action: "delete", description: "Delete customers" },

  // INVENTORY
  { module: "INVENTORY", action: "create", description: "Create inventory" },
  { module: "INVENTORY", action: "read", description: "View inventory" },
  { module: "INVENTORY", action: "update", description: "Update inventory" },
  { module: "INVENTORY", action: "delete", description: "Delete inventory" },

  // REPORT
  { module: "REPORT", action: "read", description: "View reports" },

  // SETTINGS
  { module: "SETTINGS", action: "update", description: "Update settings" },
];

export default permissions;