-- DropForeignKey
ALTER TABLE "Truck" DROP CONSTRAINT "Truck_createdById_fkey";

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
