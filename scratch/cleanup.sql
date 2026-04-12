DELETE FROM "category" WHERE "slug" ILIKE '%test%' OR "name" ILIKE '%test%';
DELETE FROM "product" WHERE "name" ILIKE '%Testing%' OR "name" ILIKE '%test%';
