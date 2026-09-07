-- Normalize legacy CDN URLs that were stored without http:// or https://.
UPDATE `Event`
SET `logo` = CONCAT('https://', `logo`)
WHERE `logo` NOT LIKE 'http://%'
  AND `logo` NOT LIKE 'https://%'
  AND `logo` NOT LIKE '/%';

UPDATE `EventGallery`
SET `imageUrl` = CONCAT('https://', `imageUrl`)
WHERE `imageUrl` NOT LIKE 'http://%'
  AND `imageUrl` NOT LIKE 'https://%'
  AND `imageUrl` NOT LIKE '/%';

UPDATE `GlobalGallery`
SET `imageUrl` = CONCAT('https://', `imageUrl`)
WHERE `imageUrl` NOT LIKE 'http://%'
  AND `imageUrl` NOT LIKE 'https://%'
  AND `imageUrl` NOT LIKE '/%';

UPDATE `Partner`
SET `logo` = CONCAT('https://', `logo`)
WHERE `logo` NOT LIKE 'http://%'
  AND `logo` NOT LIKE 'https://%'
  AND `logo` NOT LIKE '/%';
