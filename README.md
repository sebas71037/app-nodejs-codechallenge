# Start the project

The **docker-compose.yml** file has been updated to bring up 3 new containers:

-   Transactions
-   Anti-fraud
-   PgAdmin

Run the project:

```bash
docker-compose up --build -d
```

The transactions and anti-fraud services will not start immediately, waiting for the Kafka service to finish starting properly to avoid connection issues.

## Containers

![containers](https://github.com/user-attachments/assets/9fc6f045-217d-4bdc-ad5f-49ec156290e5)

# Create transaction
Before sending the request to create a transaction, it is necessary to check the logs of the **transactions** and **anti-fraud** containers. You can do this from the console by running:

```bash
docker-compose logs -f container-name
```

Send request: 

```curl
curl --location 'http://localhost:3000/transactions' \
--header 'Content-Type: application/json' \
--data '{
  "accountExternalIdDebit": "3a0d67f4-a62d-4e38-a161-1a31c321ac9f",
  "accountExternalIdCredit": "087036f1-3fd3-4b1e-847e-21bf1fe23bfa",
  "transferTypeId": 1,
  "value": 100
}'
```

![request](https://github.com/user-attachments/assets/31ba5401-c2e9-495d-8594-02569f4ad65d)

For the test, 2 requests were sent, one with a value of 1200 and another with a value of 1000, to have 2 transactions, one rejected and the other approved.

Transaction and anti-fraud container consoles respectively:

![logs](https://github.com/user-attachments/assets/e6879bd2-dd42-4091-9749-8ce7a76a9d51)

You can check the database from **pgadmin**

![pgadmin](https://github.com/user-attachments/assets/2b806ea8-669c-434d-8b66-b0f58773ffcd)

**User:** admin@admin.com
**Password:** admin


