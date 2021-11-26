## Problem 1
SELECT 
	tree.id, 
	tree.`friendly_name`, 
	tree.`scientific_name`, 
	usr.`name`, 
	usr.`email`,
	(SELECT count(*) FROM likes_table as likes	 WHERE likes.tree_id = tree.id) as 'likes'
FROM tree_table as tree inner join user_table as usr on tree.`owner_id` = usr.`id`
WHERE usr.email='adam@versett.com'

## Problem 2
##### npm install
##### ng serve --open