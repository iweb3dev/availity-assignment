SELECT c.CustID,
       co.CustomerCost CustomerCost
FROM   [customer] c
       LEFT JOIN (SELECT o.CustomerID,
                         Sum(ol.OrderCost) CustomerCost
                  FROM   [order] o
                         JOIN (SELECT OrdID,
                                      Sum(Cost * Quantity) OrderCost
                               FROM   orderline
                               GROUP  BY OrdID) ol
                           ON o.OrderID = ol.OrdID
                  WHERE  o.OrderDate > Dateadd(month, -6, Getdate())
                  GROUP  BY o.CustomerID) co
              ON c.CustID = co.CustomerID
WHERE  co.CustomerCost > 100
       AND co.CustomerCost < 500;