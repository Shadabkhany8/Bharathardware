-- V3: Update Owner to Shadab Khan, phone to 8305288431, and operating headquarters to Indore, Madhya Pradesh
UPDATE customers
SET name = 'Shadab Khan',
    business_name = 'Bharat Sponge Enterprises (Indore)',
    phone = '8305288431',
    address = 'Sanwer Road Industrial Area',
    city = 'Indore',
    state = 'Madhya Pradesh',
    pincode = '452015'
WHERE email = 'admin@bharatsponge.com';

UPDATE customers
SET address = 'Shop No. 42, Loha Mandi, Malwa Mills Road',
    city = 'Indore',
    state = 'Madhya Pradesh',
    pincode = '452001'
WHERE email = 'customer@bharatsponge.com';
