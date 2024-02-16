-- CreateEnum
CREATE TYPE "Fuel" AS ENUM ('GAS', 'KEROSENE', 'PROPANE_BUTANE', 'METHANE', 'HYBRID_HEV', 'HYBRID_PHEV', 'DIESEL', 'ELECTRO');

-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('MANUAL', 'AUTOMATIC', 'TIPTRONIC', 'ROBOT', 'VARIATOR');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('ALL_TYPE', 'LIGHTWEIGHT', 'MOTTO', 'TRUCKS', 'TRAILER', 'SPECIAL_EQUIPMENT', 'AGRICULTURAL_MACHINERY', 'BUSES', 'WATER_TRANSPORT', 'AIR_TRANSPORT', 'MOTOR_HOMES');

-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('SEDAN', 'STATION_WAGON', 'SUV_CROSSOVER', 'MINIVAN', 'LIFTBACK', 'MICROWAVE', 'COUPE', 'PICKUP', 'ROADSTER', 'HATCHBACK', 'CABRIOLET', 'LIMOUSINE', 'FASTBACK');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('VINNYTSIA', 'VOLYN', 'DNIPROPETROVSK', 'DONETSK', 'ZHYTOMYR', 'ZAKARPATTIA', 'ZAPORIZHIA', 'IVANO_FRANKIVSK', 'KYIV', 'KYIVOBL', 'KIROVOHRAD', 'LUHANSK', 'LVIV', 'MYKOLAIV', 'ODESSA', 'POLTAVA', 'RIVNE', 'SUMY', 'TERNOPIL', 'KHARKIV', 'KHERSON', 'KHMELNYTSKYI', 'CHERKASY', 'CHERNIVTSI', 'CHERNIHIV');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('COMPLETELY_INTACT', 'PROFESSIONALLY_REPAIR', 'UNREPAIRED', 'NO_RUN');

-- CreateEnum
CREATE TYPE "PaintCondition" AS ENUM ('NEW', 'PROFFESIONAL_REPAIR', 'NO_REPAIR');

-- CreateEnum
CREATE TYPE "Seller" AS ENUM ('ALL', 'COMPANY', 'PRIVATE_PERSONE');

-- CreateEnum
CREATE TYPE "DriverType" AS ENUM ('FRONT', 'FULL', 'REAR');

-- CreateEnum
CREATE TYPE "Eco" AS ENUM ('EURO6', 'EURO5', 'EURO4', 'EURO3', 'EURO2', 'EURO1');

-- CreateEnum
CREATE TYPE "engineType" AS ENUM ('OPPOSITE', 'V_SHAPED', 'ORDINARY', 'OTHER');

-- CreateEnum
CREATE TYPE "CountOfDoor" AS ENUM ('THREE', 'FIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'EMAIL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "Provider" NOT NULL DEFAULT 'EMAIL',
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "nick_name" TEXT NOT NULL,
    "last_online_at" TIMESTAMP(3),
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "token" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popular" DOUBLE PRECISION NOT NULL,
    "logo" TEXT NOT NULL,
    "year_start" TIMESTAMP(3) NOT NULL,
    "year_end" TIMESTAMP(3) NOT NULL,
    "brand_id" TEXT NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "country_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("country_code")
);

-- CreateTable
CREATE TABLE "vehiclesOptions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "vehiclesOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleOnVehicleOptions" (
    "option_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,

    CONSTRAINT "VehicleOnVehicleOptions_pkey" PRIMARY KEY ("option_id","vehicle_id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popular" DOUBLE PRECISION NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "odometre" DOUBLE PRECISION NOT NULL,
    "engine" DECIMAL(65,30) NOT NULL,
    "fuel" "Fuel" NOT NULL,
    "color" TEXT NOT NULL,
    "transmission" "Transmission" NOT NULL,
    "type" "Type" NOT NULL,
    "body_type" "BodyType" NOT NULL,
    "region" "Region" NOT NULL,
    "city" TEXT NOT NULL,
    "is_road_accident" BOOLEAN NOT NULL,
    "condition" "Condition" NOT NULL,
    "paint_condition" "PaintCondition" NOT NULL,
    "is_in_ukr" BOOLEAN NOT NULL,
    "is_cleaning" BOOLEAN NOT NULL,
    "is_from_usa" BOOLEAN NOT NULL,
    "is_in_creadit" BOOLEAN NOT NULL,
    "is_in_confiscat" BOOLEAN NOT NULL,
    "seller" "Seller" NOT NULL,
    "drive_from_id" TEXT NOT NULL,
    "drive_type" "DriverType" NOT NULL,
    "eco" "Eco" NOT NULL,
    "fuel_consumption" DECIMAL(65,30) NOT NULL,
    "engine_type" "engineType" NOT NULL,
    "engine_power" DOUBLE PRECISION NOT NULL,
    "count_of_door" "CountOfDoor" NOT NULL,
    "count_of_seat" DECIMAL(65,30) NOT NULL,
    "vin_code" TEXT NOT NULL,
    "is_saling" TEXT NOT NULL,
    "is_new_car" BOOLEAN NOT NULL,
    "is_cycles" BOOLEAN NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "optionsTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "vehicle_options_id" TEXT NOT NULL,

    CONSTRAINT "optionsTypes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "countries_country_code_key" ON "countries"("country_code");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOnVehicleOptions" ADD CONSTRAINT "VehicleOnVehicleOptions_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOnVehicleOptions" ADD CONSTRAINT "VehicleOnVehicleOptions_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "vehiclesOptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_drive_from_id_fkey" FOREIGN KEY ("drive_from_id") REFERENCES "countries"("country_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optionsTypes" ADD CONSTRAINT "optionsTypes_vehicle_options_id_fkey" FOREIGN KEY ("vehicle_options_id") REFERENCES "vehiclesOptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
