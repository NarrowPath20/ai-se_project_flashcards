# Flash Cards

Flash Cards is a browser-based study app created as part of TripleTen's
AI-Assisted Software Engineering program. It organizes web-development topics
into color-coded decks and lets learners review each deck one card at a time.
The project was built to practice semantic HTML, responsive CSS, JavaScript
modules, DOM manipulation, and client-side navigation without a framework.

## Deployed Site

View the live [Flash Cards application](https://narrowpath20.github.io/ai-se_project_flashcards/)
on GitHub Pages.

## Project Pitch Video

Check out [this video](https://drive.google.com/file/d/1c0u_8a6olTwjaNTR7K3uIl--MEt930DL/view?usp=sharing),
where I describe my project and some challenges I faced while building it.

## Features

- Browse 12 built-in decks containing 120 flashcards about HTML, CSS,
  JavaScript, browser developer tools, web terminology, and Git.
- See the number of cards in each deck at a glance.
- Open a deck, preview its questions, and choose which question to start with.
- Move forward or backward through a deck and flip between questions and
  answers.
- Delete decks or individual cards through a reusable confirmation modal.
- Navigate between views with URL hashes and see a not-found view for invalid
  routes or deck IDs.
- Use accessible controls with descriptive labels and disabled states.
- Use responsive home, open-deck, and carousel layouts with fixed mobile action
  controls.

## Technologies Used

- HTML5
- CSS3 and Normalize.css
- JavaScript (ES modules)
- DOM APIs and HTML templates
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

## Project Structure

```text
.
|-- assets/
|   |-- css/        # BEM page styles and responsive mobile action bar
|   |-- images/     # Interface icons
|   |-- js/         # Deck data, routing, colors, and carousel behavior
|   `-- vendor/     # Normalize.css
|-- favicon.ico
|-- index.html
`-- README.md
```

## Planned Improvements

- Connect the **New Deck** button to a form so users can create custom decks
  and flashcards.
- Persist created and deleted decks in `localStorage` so changes survive a page
  refresh.
- Add an About view with instructions for using the study carousel.
- Add progress tracking so learners can mark cards as known or review them
  again.

## Author

[Dustin Bates](https://github.com/NarrowPath20)
