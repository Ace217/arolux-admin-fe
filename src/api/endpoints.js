export const LOGIN = "admin/login";
export const ACCOUNT = "admin/account";
export const ACCOUNTS = "admin/accounts";
export const UPDATE = "admin/:adminId/account";
export const PASSWORD = "admin/:adminId/account/password";
export const VEHICLE_CATEGORIES = "admin/vehicle-categories/list";
export const CREATE_VEHICLE_CATEGORY = "admin/vehicle-categories/record";
export const UPDATE_VEHICLE_CATEGORY = "admin/vehicle-categories/:id";
export const CUSTOMERS_LIST = "admin/users/list";
export const CUSTOMER_DETAILS = "admin/users/:userId/details";
export const UPDATE_CUSTOMER_STATUS = "admin/users/:userId/status";
export const UPDATE_CUSTOMER = "admin/users/:userId";
export const DRIVERS_LIST = "admin/users/drivers/list";
export const DRIVER_DETAILS = "admin/users/drivers/:driverId/details";
export const GET_FILE = "file";
export const RIDE_BOOKINGS_LIST = "admin/ride-bookings/list";
export const RIDE_BOOKING_DETAILS = "admin/ride-bookings/:bookingId/details";
export const CONFIGURATIONS = "admin/configurations";
export const GEO_LOCATIONS_LIST = "admin/geo-locations/list";
export const GEO_LOCATION_DETAILS = "admin/geo-locations/:locationId/details";
export const CREATE_GEO_LOCATION = "admin/geo-locations/record";
export const UPDATE_GEO_LOCATION = "admin/geo-locations/:locationId";
export const VEHICLE_CATEGORY_FARES_LIST = "admin/vehicle-category-fares/list";
export const VEHICLE_CATEGORY_FARE_DETAILS =
  "admin/vehicle-category-fares/:fareId/details";
export const CREATE_VEHICLE_CATEGORY_FARE = "admin/vehicle-category-fares";
export const UPDATE_VEHICLE_CATEGORY_FARE =
  "admin/vehicle-category-fares/:fareId";
export const VEHICLE_CATEGORY_FARES_GEO_LOCATIONS =
  "admin/vehicle-category-fares/geo-locations";
export const VEHICLE_CATEGORY_FARES_VEHICLE_CATEGORIES =
  "admin/vehicle-category-fares/vehicle-categories";
export const PROMO_CODES_LIST = "admin/promo-codes/list";
export const PROMO_CODE_DETAILS = "admin/promo-codes/:promoCodeId/details";
export const CREATE_PROMO_CODE = "admin/promo-codes";
export const UPDATE_PROMO_CODE = "admin/promo-codes/:promoCodeId";
export const TOGGLE_PROMO_CODE_STATUS = "admin/promo-codes/:promoCodeId/status";
export const DELETE_PROMO_CODE = "admin/promo-codes/:promoCodeId";
export const LOCATIONS = "admin/geo-locations";

export const PROMO_CODES_GEO_LOCATIONS = "admin/promo-codes/geo-locations";
export const PROMO_CODES_VEHICLE_CATEGORIES =
  "admin/promo-codes/vehicle-categories";
