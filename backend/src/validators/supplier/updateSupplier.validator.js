import { body } from "express-validator";

import STATUS from "../../constants/status.js";

export const updateSupplierValidator = [
  body("name").optional().trim().isLength({ max: 150 }),
  body("code").optional().trim().isLength({ max: 50 }),
  body("contactPerson").optional().trim(),
  body("email").optional({ nullable: true }).isEmail(),
  body("phone").optional().trim(),
  body("alternatePhone").optional().trim(),
  body("gstNumber").optional().trim(),
  body("panNumber").optional().trim(),
  body("address").optional().trim(),
  body("city").optional().trim(),
  body("state").optional().trim(),
  body("country").optional().trim(),
  body("postalCode").optional().trim(),
  body("creditLimit").optional().isFloat({ min: 0 }),
  body("paymentTerms").optional().isInt({ min: 0 }),
  body("openingBalance").optional().isFloat(),
  body("isPreferred").optional().isBoolean(),
  body("status").optional().isIn(Object.values(STATUS)),
];