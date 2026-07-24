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

 // PRODUCT
{
  module: "PRODUCT",
  action: "create",
  description: "Create products",
},
{
  module: "PRODUCT",
  action: "read",
  description: "View products",
},
{
  module: "PRODUCT",
  action: "update",
  description: "Update products",
},
{
  module: "PRODUCT",
  action: "delete",
  description: "Delete products",
},

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

  // UNIT
{
  module: "UNIT",
  action: "create",
  description: "Create units",
},
{
  module: "UNIT",
  action: "read",
  description: "View units",
},
{
  module: "UNIT",
  action: "update",
  description: "Update units",
},
{
  module: "UNIT",
  action: "delete",
  description: "Delete units",
},

// TAX
{
  module: "TAX",
  action: "create",
  description: "Create taxes",
},
{
  module: "TAX",
  action: "read",
  description: "View taxes",
},
{
  module: "TAX",
  action: "update",
  description: "Update taxes",
},
{
  module: "TAX",
  action: "delete",
  description: "Delete taxes",
},

// SUPPLIER
{
  module: "SUPPLIER",
  action: "create",
  description: "Create suppliers",
},
{
  module: "SUPPLIER",
  action: "read",
  description: "View suppliers",
},
{
  module: "SUPPLIER",
  action: "update",
  description: "Update suppliers",
},
{
  module: "SUPPLIER",
  action: "delete",
  description: "Delete suppliers",
},

// PURCHASE
{
  module: "PURCHASE",
  action: "create",
  description: "Create purchases",
},
{
  module: "PURCHASE",
  action: "view",
  description: "View purchases",
},
{
  module: "PURCHASE",
  action: "update",
  description: "Update purchases",
},
{
  module: "PURCHASE",
  action: "delete",
  description: "Delete purchases",
},
{
  module: "PURCHASE",
  action: "approve",
  description: "Approve purchases",
},
{
  module: "PURCHASE",
  action: "receive",
  description: "Receive purchases",
},
{
  module: "PURCHASE",
  action: "cancel",
  description: "Cancel purchases",
},

  // SETTINGS
  { module: "SETTINGS", action: "update", description: "Update settings" },
];

export default permissions;