SELECT c.CustID,
       co.CustomerCost CustomerCost
FROM   [customer] c
       LEFT JOIN (SELECT o.CustomerID,
                         SUM(ol.OrderCost) CustomerCost
                  FROM   [order] o
                         JOIN (SELECT OrdID,
                                      SUM(Cost * Quantity) OrderCost
                               FROM   orderline
                               GROUP  BY OrdID) ol
                           ON o.OrderID = ol.OrdID
                  WHERE  o.OrderDate > DATEADD(month, -6, GETDATE())
                  GROUP  BY o.CustomerID) co
              ON c.CustID = co.CustomerID
WHERE  co.CustomerCost > 100
       AND co.CustomerCost < 500;