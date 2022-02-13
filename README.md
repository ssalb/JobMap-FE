## NOTE
This was part of the [#WirVsVirus Hackaton](https://wirvsvirus.org/) and it's no longer active.

# JobMap

## Backend

- Flask server runs inside docker container, exposes two end points (/biete and /suche) and handles reading/writing of data into a NoSQL database
- Docker container deployed on Azure Appservice (https://jobmap.azurewebsites.net/) -> again /biete and /suche as endpoints
- Azure CosmosDB serves as a scalable, fast and highly available data base

## Frontend

- React JS Web app inside a docker container, shows a map with current jobs and workers
- UI based in Material UI
- Container deployed on Azure Appservice (https://jobmapapp.azurewebsites.net/)
