## Max's Auto Dealership

A car dealership inventory manager built using HTML, CSS, JavaScript,
and Node.js. Users can add, edit, and delete cars from the inventory. The server
automatically calculates a Value Rating for each car based off year and price.
Layout uses CSS Flexbox. No page reloads are required for any action.

To use: enter a car's make, model, year, price, and MPG into the form and click
"Add Car". To edit, click the Edit button on any row. To delete, click Delete and
confirm the prompt.

## Technical Achievements

- Single-page app: when the user submits or edits data, the server responds with
  the updated dataset and the table re-renders immediately without a page reload.

- Modify existing data: each row has an Edit button that pre-fills the form with
  that car's current data. Submitting posts to /update, the server recomputes the
  Value Rating, and the table updates in place.

## Design/Evaluation Achievements

1. Casey Pietrusewicz
2. The value rating was a bit confusing to the user. Was not sure in which order the different levels went.
3. The user was confused with why the row of the table was highlighted when hovering over it. He thought there
   was a clickable function besides just the delete and edit buttons.
4. The user accidentally deleted an item, and could not remember what the values were. This could be solved
   with an undo button or a confirmation on the delete.

1. Justin Fletcher
2. The user didn't like how the carrot buttons only incremented price by one.
3. The user surprised by how fluid the edit functionality was.
4. The user suggested that having the carrot buttons increment by larger amounts the longer they were held down.

## Acknowledgements

Claude (Anthropic) assisted with portions of the CSS styling, in-code comments,
variable and function naming conventions, and some of the UI text on the page
(button labels, placeholder text, and section headings).
