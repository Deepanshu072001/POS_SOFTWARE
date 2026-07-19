const roles = [
  {
    name: "OWNER",
    description: "System Owner",
    isSystem: true,
    permissions: ["*"],
  },
  {
    name: "ADMIN",
    description: "System Administrator",
    isSystem: true,
    permissions: ["*"],
  },
  {
    name: "MANAGER",
    description: "Cafe Manager",
    isSystem: true,
    permissions: [
      "BRANCH.READ",
      "BRANCH.UPDATE",

      "DASHBOARD.READ",

      "MENU.CREATE",
      "MENU.READ",
      "MENU.UPDATE",

      "CATEGORY.CREATE",
      "CATEGORY.READ",
      "CATEGORY.UPDATE",

      "ORDER.READ",
      "ORDER.UPDATE",

      "CUSTOMER.CREATE",
      "CUSTOMER.READ",
      "CUSTOMER.UPDATE",

      "INVENTORY.READ",
      "INVENTORY.UPDATE",
      
      "REPORT.READ",
    ],
  },
  {
    name: "CASHIER",
    description: "Cashier",
    isSystem: true,
    permissions: [
      "ORDER.CREATE",
      "ORDER.READ",
      "PAYMENT.CREATE",
      "CUSTOMER.CREATE",
      "CUSTOMER.READ",
      "MENU.READ",
      "CATEGORY.READ",
    ],
  },
  {
    name: "KITCHEN",
    description: "Kitchen Staff",
    isSystem: true,
    permissions: [
      "ORDER.READ",
      "ORDER.UPDATE",
    ],
  },
];

export default roles;