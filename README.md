# My Form DAG-form-manager challenge!

## How to run it locally:

First, you will need the backend mock database that can be found [here](https://github.com/mosaic-avantos/frontendchallengeserver)
Once you download it, run the "npm start" command within the folder of your project.

As for the frontend part, which is this repo:
1. Clone the repo
2. install dependencies using the "npm install" commmand
3. run "npm run dev" to run it locally
**Note: the backend server is configured to run on port 3000, which is also NextJS default port. Because of this, the NextJS is pre-configured to run on port 3001.**
4. visit http://localhost:3001/ to see the project, if the build is successful.
5. To run tests, run "npx jest" in the terminal.

##  Extending with new data sources

The data for this project is coming from the fetchGraph.ts which is in the utils folder. You can plug in any other data source in here and it should load into the project.
However, pay atention that the structure must satisfy the required model - please see under types.ts, which is in the types folder. Start form the GraphData type and work your way down.

## Some of the patterns to notice:

1. Separation of concerns - The project is well structured and components, tests, types, utils etc. are all within their respective folders.
2. Single source of truth - All updates (mapping changes, toggle states) are stored in React state and  flow through props, ensuring sync.
3. Contextual UI	- The popup panel and prefill source selector appear relative to the selected node or field.
4. Declarative state updates	- React hooks manage local state transitions cleanly, updating mappings without mutating the original object.
