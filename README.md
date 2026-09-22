# Flash Cards

Flash Cards is a browser-based study app created as part of TripleTen's
AI-Assisted Software Engineering program. It organizes web-development topics
into color-coded decks and lets learners review each deck one card at a time.
The project was built to practice semantic HTML, responsive CSS, JavaScript
modules, DOM manipulation, client-side navigation, and API requests without a framework.

## Deployed Site

View the live [Flash Cards application](https://narrowpath20.github.io/ai-se_project_flashcards/)
on GitHub Pages.

## Project Pitch Video

Check out [this video](https://drive.google.com/file/d/1c0u_8a6olTwjaNTR7K3uIl--MEt930DL/view?usp=sharing),
where I describe my project and some challenges I faced while building it.

## Features

- Load your saved decks and flashcards from the TripleTen API on every visit.
- Create decks by pasting JSON and choosing a color; the server saves each deck
  and assigns IDs to its cards.
- Add cards with a two-sided form, flip between the question and answer, and
  save with the check button. Edit existing cards with the pencil button.
- See the number of cards in each deck at a glance.
- Open a deck, preview its questions, and choose which question to start with.
- Move forward or backward through a deck and flip between questions and
  answers.
- Delete decks or individual cards through a reusable confirmation modal,
  with changes saved to the server before they disappear from the page.
- Retry failed loading or deletion requests and keep form input after failed saves.
- See validation and server errors in a modal with a clear message.
- Read instructions and a sample JSON deck in the About view at `#about`.
- Navigate between views with URL hashes and see a not-found view for invalid
  routes or deck IDs.
- Use accessible controls with descriptive labels and disabled states.
- Use responsive home, open-deck, and carousel layouts with fixed mobile action
  controls.
- Explore all named JavaScript functions through JSDoc descriptions, parameter
  types, and return types.

## Technologies Used

- HTML5
- CSS3 and Normalize.css
- JavaScript (ES modules)
- DOM APIs and HTML templates
- Fetch API and the TripleTen flashcards REST API
- CSS Grid and Flexbox
- BEM naming methodology
- Google Fonts (Inter)

## Running the Project

The app has no build step or package dependencies. You only need a modern web
browser and a local web server because the JavaScript files use ES modules.

1. Clone the repository:

   ```bash
   git clone git@github.com:NarrowPath20/ai-se_project_flashcards.git
   ```

2. Move into the project directory:

   ```bash
   cd ai-se_project_flashcards
   ```

3. Start a local server. For example, with Python 3:

   ```bash
   python -m http.server 8000
   ```

4. Open [http://localhost:8000](http://localhost:8000) in your browser.

You can also use a local-server extension such as Live Server in VS Code.

## API Setup

The app uses the [TripleTen flashcards API](https://se-flashcards-api.en.tripleten-services.com/api-docs).
The educational token is configured in `assets/js/api.js` and sent in the
`Authorization` header. This course explicitly permits storing this particular
token in the project; it is not a pattern for production credentials.

To use a separate set of decks, get a token from the
[token endpoint](https://se-flashcards-api.en.tripleten-services.com/auth/token)
and replace the token in `api.js`. Keep the same token to access the same saved decks.

The app uses `GET /v1/decks`, `POST /v1/decks`,
`DELETE /v1/decks/{id}`, `POST /v1/cards/{deckId}`,
`PUT /v1/cards/{id}`, and `DELETE /v1/cards/{id}`.
Deck content is stored in a database through this remote API. The shared
`fetchedDecks` array caches the server response for routing and rendering, using
the database's `_id` fields directly.

To create a deck, click **New Deck**, select a color, and paste JSON such as:

```json
{
  "name": "Study Notes",
  "cards": [
    { "question": "What does HTML stand for?", "answer": "HyperText Markup Language" }
  ]
}
```

After creating or deleting a deck, reload the page to see the saved result.

## Documentation and Verification

All named functions in `assets/js` have JSDoc descriptions and return types;
functions with parameters document each parameter and its type. The `Card` and
`Deck` typedefs in `decks.js` describe the API data shared between modules.

Browser verification covers loading decks, creating and deleting decks,
creating/editing/deleting individual cards, and reloading to confirm persistence.
It also covers invalid form data, failed requests and retries, empty-deck practice,
direct links to deck and carousel views, and About and card form layouts at
320, 375, and 1440 pixels. Temporary test decks are removed after verification.

## Project Structure

```text
.
|-- assets/
|   |-- css/        # BEM page styles and responsive mobile action bar
|   |-- images/     # Interface icons
|   |-- js/         # API requests, deck state, routing, forms, and carousel behavior
|   `-- vendor/     # Normalize.css
|-- favicon.ico
|-- index.html
`-- README.md
```

## Planned Improvements

- Add progress tracking so learners can mark cards as known or review them
  again.

## Author

[Dustin Bates](https://github.com/NarrowPath20)
