--Query 01
--Inserting data into `account` table
INSERT INTO public.account (
account_firstname,
account_lastname,
account_email,
account_password
)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Query 02
--Modifing the Tony Stark record to change the account_type to "Admin".
UPDATE public.account
SET account_type = 'Admin'::account_type
WHERE account_id = 1;

--Query 03
--Deleting the Tony Stark record from the database.
DELETE FROM public.account
WHERE account_id = 1;

--Query 04
--Modifying the "GM Hummer" record
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_id = 10;

--Query 05
--Using INNER JOIN to show related data form classification and inventory table
SELECT 
inventory.inv_make,
inventory.inv_model,
classification.classification_name
FROM
inventory
INNER JOIN
classification
ON
inventory.classification_id = classification.classification_id
WHERE
classification.classification_name = 'Sport';

--Query 06
--Updating all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns
UPDATE public.inventory
SET 
inv_image = REPLACE(inv_image, '/images/','/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')



