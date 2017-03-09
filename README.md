# sepi-server
A NodeJS server for the SEPI ESCOM system.

# Change history

## 26-Jan-2017
  - Added all input fields in SIP-01 format webpage
  - Changed PDF creator to accept those added fields
  - TO-DO: Link DB connection with form webpage to extract subjects and include them in the generated PDF

## 19-Feb-2017
  - Implemented basic integration with DB via signals and events
  - Experimental EJS templating via external, editable JSON files
  - Added NodeMon as development tool for server restart when changing source code

## 09-Mar-2017
  - Updated EJS structure in order to allow sub-parts in HTML and ordered items
  - Modelled the sign-up process as a callable API with JSON responses
  - Integration of JSON-based content is easier at the server side
  - The sign up form now uses AJAX to request user addition in the DB.
