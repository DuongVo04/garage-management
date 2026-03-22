CREATE TABLE account (
  id           varchar(50) NOT NULL, 
  username     varchar(100) NOT NULL UNIQUE, 
  password     varchar(100) NOT NULL, 
  is_activated tinyint(1) NOT NULL, 
  role_id      varchar(50) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE brand (
  id         varchar(50) NOT NULL, 
  name       varchar(100) NOT NULL UNIQUE, 
  country    varchar(100) NOT NULL, 
  logo_url   varchar(255) NOT NULL, 
  is_deleted tinyint(1) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE car_return_appointment (
  id               varchar(50) NOT NULL, 
  created_date     datetime NULL, 
  return_date      datetime NULL, 
  repair_ticket_id varchar(50) NOT NULL);
CREATE TABLE customer (
  id           varchar(50) NOT NULL, 
  full_name    varchar(50) NOT NULL, 
  phone_number varchar(10) NOT NULL UNIQUE, 
  email        varchar(100), 
  address      varchar(200), 
  accountid    varchar(50) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE customer_vehicle (
  id           varchar(50) NOT NULL, 
  name         varchar(20) NOT NULL, 
  color        varchar(10) NOT NULL, 
  type         varchar(10) NOT NULL, 
  plate_number varchar(20), 
  lastest_odo  int(11) NOT NULL, 
  year         int(5) NOT NULL, 
  image        varchar(255), 
  is_deleted   tinyint(1) NOT NULL, 
  customer_id  varchar(50), 
  brand_id     varchar(50) NOT NULL, 
  origin       varchar(20), 
  seats        int(2), 
  is_soild     tinyint(1), 
  PRIMARY KEY (id));
CREATE TABLE employee (
  id               varchar(50) NOT NULL, 
  employee_name    varchar(50) NOT NULL, 
  phone_number     varchar(10) NOT NULL UNIQUE, 
  email            varchar(100), 
  address          varchar(100), 
  salary           decimal(19, 0), 
  work_start_date  date NOT NULL, 
  is_working       tinyint(1) NOT NULL, 
  account_id       varchar(50) NOT NULL, 
  employee_type_id varchar(50) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE employee_type (
  id          varchar(50) NOT NULL, 
  name        varchar(20), 
  is_deleted  tinyint(1) NOT NULL, 
  description text, 
  PRIMARY KEY (id));
CREATE TABLE engine_technical_specification (
  engine_type         varchar(100) NOT NULL, 
  engine_capacity     varchar(50), 
  max_power           double NOT NULL, 
  max_torque          varchar(50), 
  showroom_vehicle_id varchar(50) NOT NULL, 
  PRIMARY KEY (showroom_vehicle_id));
CREATE TABLE fuel (
  fuel_type           varchar(100) NOT NULL, 
  fuel_consumption    varchar(50), 
  fuel_tank_capacity  varchar(50), 
  showroom_vehicle_id varchar(50) NOT NULL, 
  PRIMARY KEY (showroom_vehicle_id));
CREATE TABLE interior (
  seat_count                  int(11) NOT NULL, 
  is_androidauto_applecarplay tinyint(1) NOT NULL, 
  showroom_vehicle_id         varchar(50) NOT NULL, 
  PRIMARY KEY (showroom_vehicle_id));
CREATE TABLE invoice (
  id             varchar(50) NOT NULL, 
  created_date   date NOT NULL, 
  total_cost     decimal(20, 0), 
  payment_method varchar(20), 
  discount_id    varchar(50), 
  ticket_id      varchar(50) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE repair_appointment (
  id               varchar(50) NOT NULL, 
  created_date     datetime NULL, 
  appointment_date datetime NOT NULL, 
  status           varchar(20) NOT NULL, 
  customer_id      varchar(50) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE repair_detail (
  id          varchar(50) NOT NULL, 
  ticket_id   varchar(50) NOT NULL, 
  employee_id varchar(50) NOT NULL, 
  usage_id    varchar(50), 
  repair_date date NOT NULL, 
  note        varchar(100), 
  PRIMARY KEY (id, 
  ticket_id, 
  employee_id));
CREATE TABLE repair_ticket (
  id                  varchar(50) NOT NULL, 
  description         varchar(50), 
  created_date        datetime NOT NULL, 
  compeled_date       date, 
  service_id          varchar(50) NOT NULL, 
  appointment_id      varchar(50), 
  customer_vehicle_id varchar(50) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE role (
  id          varchar(50) NOT NULL, 
  name        varchar(20) NOT NULL UNIQUE, 
  is_deleted  tinyint(1) NOT NULL, 
  description text NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE service (
  id          varchar(50) NOT NULL, 
  name        varchar(50) NOT NULL UNIQUE, 
  description text, 
  price       decimal(19, 0) NOT NULL, 
  is_deleted  tinyint(1) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE showroom_vehicle (
  id          varchar(50) NOT NULL, 
  name        varchar(100) NOT NULL, 
  year        int(5) NOT NULL, 
  old_price   decimal(19, 0), 
  new_price   decimal(19, 0) NOT NULL, 
  status      tinyint(1) NOT NULL, 
  color       varchar(10) NOT NULL, 
  lastest_odo int(11), 
  thumbnail   varchar(255), 
  description text, 
  is_deleted  tinyint(1) NOT NULL, 
  brand_id    varchar(50) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE showroom_vehicle_image (
  id                  varchar(50) NOT NULL, 
  description         varchar(50) NOT NULL, 
  image_path          varchar(255) NOT NULL, 
  showroom_vehicle_id varchar(50) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE spare_parts (
  id                varchar(50) NOT NULL, 
  name              varchar(100) NOT NULL UNIQUE, 
  quantity_in_stock int(11) NOT NULL, 
  unit_price        decimal(19, 0), 
  unit_of_measure   varchar(100), 
  image             varchar(255), 
  PRIMARY KEY (id));
CREATE TABLE square_parts_usage (
  id             varchar(50) NOT NULL, 
  quantity       int(11) NOT NULL, 
  usage_date     date NOT NULL, 
  spare_parts_id varchar(50) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE square_parts_warranty (
  id         varchar(50) NOT NULL, 
  start_date int(10) NOT NULL, 
  duration   int(2) NOT NULL, 
  usage_id   varchar(50) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE steering_system (
  transmission        varchar(100) NOT NULL, 
  drivertrain         varchar(100) NOT NULL, 
  showroom_vehicle_id varchar(50) NOT NULL, 
  PRIMARY KEY (showroom_vehicle_id));
CREATE TABLE vehicle_size (
  length_nm           int(11) NOT NULL, 
  width_nm            int(11) NOT NULL, 
  height_nm           int(11) NOT NULL, 
  whelbase_nm         int(11) NOT NULL, 
  showroom_vehicle_id varchar(50) NOT NULL, 
  PRIMARY KEY (showroom_vehicle_id));
CREATE TABLE voucher (
  id           varchar(50) NOT NULL, 
  code         varchar(20) NOT NULL UNIQUE, 
  `from`       date NOT NULL, 
  `to`         date NOT NULL, 
  `percent`    int(11) NOT NULL, 
  event        varchar(255) NOT NULL, 
  is_available tinyint(1) NOT NULL, 
  PRIMARY KEY (id));
ALTER TABLE customer_vehicle ADD CONSTRAINT FKcustomer_v65266 FOREIGN KEY (customer_id) REFERENCES customer (id);
ALTER TABLE invoice ADD CONSTRAINT FKinvoice945694 FOREIGN KEY (discount_id) REFERENCES voucher (id);
ALTER TABLE square_parts_usage ADD CONSTRAINT FKsquare_par21317 FOREIGN KEY (spare_parts_id) REFERENCES spare_parts (id);
ALTER TABLE repair_ticket ADD CONSTRAINT FKrepair_tic122631 FOREIGN KEY (service_id) REFERENCES service (id);
ALTER TABLE repair_detail ADD CONSTRAINT FKrepair_det453694 FOREIGN KEY (ticket_id) REFERENCES repair_ticket (id);
ALTER TABLE repair_detail ADD CONSTRAINT FKrepair_det215991 FOREIGN KEY (employee_id) REFERENCES employee (id);
ALTER TABLE repair_detail ADD CONSTRAINT FKrepair_det279658 FOREIGN KEY (usage_id) REFERENCES square_parts_usage (id);
ALTER TABLE invoice ADD CONSTRAINT FKinvoice444264 FOREIGN KEY (ticket_id) REFERENCES repair_ticket (id);
ALTER TABLE repair_ticket ADD CONSTRAINT FKrepair_tic648427 FOREIGN KEY (appointment_id) REFERENCES repair_appointment (id);
ALTER TABLE repair_ticket ADD CONSTRAINT FKrepair_tic595383 FOREIGN KEY (customer_vehicle_id) REFERENCES customer_vehicle (id);
ALTER TABLE employee ADD CONSTRAINT FKemployee179696 FOREIGN KEY (account_id) REFERENCES account (id);
ALTER TABLE account ADD CONSTRAINT FKaccount75085 FOREIGN KEY (role_id) REFERENCES role (id);
ALTER TABLE employee ADD CONSTRAINT FKemployee725038 FOREIGN KEY (employee_type_id) REFERENCES employee_type (id);
ALTER TABLE repair_appointment ADD CONSTRAINT FKrepair_app372963 FOREIGN KEY (customer_id) REFERENCES customer (id);
ALTER TABLE car_return_appointment ADD CONSTRAINT FKcar_return704108 FOREIGN KEY (repair_ticket_id) REFERENCES repair_ticket (id);
ALTER TABLE square_parts_warranty ADD CONSTRAINT FKsquare_par190233 FOREIGN KEY (usage_id) REFERENCES square_parts_usage (id);
ALTER TABLE showroom_vehicle_image ADD CONSTRAINT FKshowroom_v79426 FOREIGN KEY (showroom_vehicle_id) REFERENCES showroom_vehicle (id);
ALTER TABLE customer_vehicle ADD CONSTRAINT FKcustomer_v406690 FOREIGN KEY (brand_id) REFERENCES brand (id);
ALTER TABLE showroom_vehicle ADD CONSTRAINT FKshowroom_v187930 FOREIGN KEY (brand_id) REFERENCES brand (id);
ALTER TABLE engine_technical_specification ADD CONSTRAINT FKengine_tec462158 FOREIGN KEY (showroom_vehicle_id) REFERENCES showroom_vehicle (id);
ALTER TABLE fuel ADD CONSTRAINT FKfuel503255 FOREIGN KEY (showroom_vehicle_id) REFERENCES showroom_vehicle (id);
ALTER TABLE steering_system ADD CONSTRAINT FKsteering_s783560 FOREIGN KEY (showroom_vehicle_id) REFERENCES showroom_vehicle (id);
ALTER TABLE vehicle_size ADD CONSTRAINT FKvehicle_si507708 FOREIGN KEY (showroom_vehicle_id) REFERENCES showroom_vehicle (id);
ALTER TABLE interior ADD CONSTRAINT FKinterior749273 FOREIGN KEY (showroom_vehicle_id) REFERENCES showroom_vehicle (id);
ALTER TABLE customer ADD CONSTRAINT FKcustomer799894 FOREIGN KEY (accountid) REFERENCES account (id);
