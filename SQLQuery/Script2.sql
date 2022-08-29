SELECT c.CustID,
       ISNULL(co.CustomerCost, 0) CustomerCost
FROM   [Customer] c
       LEFT JOIN (SELECT o.CustomerID,
                         Sum(ol.Ordercost) CustomerCost
                  FROM   [Order] o
                         JOIN (SELECT OrdID,
                                      Sum(Cost * Quantity) OrderCost
                               FROM   OrderLine
                               GROUP  BY OrdID) ol
                           ON o.OrderID = ol.OrdID
                  WHERE  o.OrderDate > DATEADD(month, -6, GETDATE())
                  GROUP  BY o.CustomerID) co
              ON c.CustID = co.CustomerID; 