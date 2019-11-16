# Process Git Archive


#### Project Setup

  - Download the archive file from [here](http://data.githubarchive.org/2019-01-01-15.json.gz).
  - Extract the .gzip file to `src/data`. Or, update `datasourcepath` in config.json (path: `src/config`)
  - Update `dbconnection`, `dbname` and `collectionname` in config.json (path: `src/config`) for modifying the DB connection.
  - Update `serverport` in config.json (path: `src/config`) for modifying the API server port.
  - Execute 
       ```$ npm install``` or
       ```$ yarn install```
  - Execute `$ npm run start:import` for importing the data from the json data file.
  - Execute `$ npm run start:api` for running the application and exposing the api.
  
  ##### API Details
 
The following are the API Details:
| API Type | Name | ARGS |
| ------ | ------ | ------ |
| GET | getallbyrepoideventtype | repoid & eventtype |
| GET | getactordetailbyactorlogin | actorid |
| GET | getrepowithhighestevents | actorid |
| GET | getrepowithtopcontributors | - |
| DELETE | deleteactor | actorid |
