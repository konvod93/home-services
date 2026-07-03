-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE INDEX "Complaint_clientId_idx" ON "Complaint"("clientId");

-- CreateIndex
CREATE INDEX "Complaint_masterId_idx" ON "Complaint"("masterId");

-- CreateIndex
CREATE INDEX "Master_region_subregion_city_district_idx" ON "Master"("region", "subregion", "city", "district");

-- CreateIndex
CREATE INDEX "Master_isActive_isVerified_idx" ON "Master"("isActive", "isVerified");

-- CreateIndex
CREATE INDEX "Master_rating_idx" ON "Master"("rating");

-- CreateIndex
CREATE INDEX "MasterApplication_status_idx" ON "MasterApplication"("status");

-- CreateIndex
CREATE INDEX "Order_clientId_idx" ON "Order"("clientId");

-- CreateIndex
CREATE INDEX "Order_masterId_idx" ON "Order"("masterId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Review_orderId_idx" ON "Review"("orderId");

-- CreateIndex
CREATE INDEX "Slot_masterId_isBusy_date_idx" ON "Slot"("masterId", "isBusy", "date");

-- CreateIndex
CREATE INDEX "User_email_role_idx" ON "User"("email", "role");

-- CreateIndex
CREATE INDEX "User_region_subregion_city_district_idx" ON "User"("region", "subregion", "city", "district");
