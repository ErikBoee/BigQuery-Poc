bq mk --project_id=hackathon-poc-bigquery --location=europe-north1 SPEND
bq mk --table --project_id=hackathon-poc-bigquery SPEND.SMALLER_SPEND table-schema.json