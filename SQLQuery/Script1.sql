SELECT *
FROM   Customer
WHERE  LastName LIKE 'S.%'
ORDER  BY FirstName DESC,
          LastName DESC;