# Summary
The goal of this project is to facilitate extracting data from [QuintoAndar](https://www.quintoandar.com.br/). You may create a custom list of properties of interest on QuintoAndar's website, then use this scraper to extract its data. Extracted data is written in a local '.csv' file, ready to be exported to a spreadsheet.

## How to use?

1. Open the page with your list of properties of interest.
2. Copy the ID of your list (listID) from the URL, which is going to be in this format: https://vitrine.quintoandar.com.br/interestShared/{listID}
3. Paste your listID in the `getData` function, on `index.js`.
4. From the root of the project, call `npm start`. A file `options.csv` will be generated with the properties data.

## Format of the extracted data
(work in progress)