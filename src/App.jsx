import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { elements } from "./data/elements"
import "./App.css"

const categories = [
  "All",
  "Alkali metal",
  "Alkaline earth metal",
  "Lanthanide",
  "Actinide",
  "Transition metal",
  "Post-transition metal",
  "Metalloid",
  "Reactive nonmetal",
  "Noble gas",
  "Unknown"
]

function App() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [selectedElement, setSelectedElement] = useState(null)
  const [favoriteAtomicNumbers, setFavoriteAtomicNumbers] = useState(() => {
    const storedFavorites = window.localStorage.getItem("chemistry-hub-favorites")

    if (!storedFavorites) {
      return []
    }

    try {
      const parsedFavorites = JSON.parse(storedFavorites)

      return Array.isArray(parsedFavorites)
        ? parsedFavorites.filter((value) => Number.isInteger(value))
        : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(
      "chemistry-hub-favorites",
      JSON.stringify(favoriteAtomicNumbers)
    )
  }, [favoriteAtomicNumbers])

  const favoriteSet = new Set(favoriteAtomicNumbers)
  const favoritesOnly = categoryFilter === "Favorites"

  const filteredElements = elements.filter((element) => {
    const query = search.toLowerCase()
    const isFavorited = favoriteSet.has(element.atomicnumber)

    const matchesSearch =
      element.name?.toLowerCase().includes(query) ||
      element.symbol?.toLowerCase().includes(query) ||
      String(element.atomicnumber).includes(query)

    const matchesCategory =
      favoritesOnly
        ? isFavorited
        : categoryFilter === "All" || element.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (atomicNumber) => {
    setFavoriteAtomicNumbers((currentFavorites) =>
      currentFavorites.includes(atomicNumber)
        ? currentFavorites.filter((value) => value !== atomicNumber)
        : [...currentFavorites, atomicNumber]
    )
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand-copy">
          <p className="brand-label">ChemKit Mini Tool</p>
          <h1>Element Explorer</h1>
          <p className="brand-subtitle">
            Explore elements, categories, and atomic properties in one
            interactive table.
          </p>
        </div>

        <div className="topbar-actions">
          <a
            className="back-link"
            href="https://chemkit.vercel.app/"
            target="_self"
            rel="noreferrer"
          >
            Back to ChemKit
          </a>

          <input
            type="text"
            placeholder="Search element..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <section className="filters">
        <button
          className={favoritesOnly ? "active" : ""}
          onClick={() =>
            setCategoryFilter((current) =>
              current === "Favorites" ? "All" : "Favorites"
            )
          }
        >
          Favorites
        </button>

        {categories.map((category) => (
          <button
            key={category}
            className={!favoritesOnly && categoryFilter === category ? "active" : ""}
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="periodic-shell">
        <div className="periodic-panel">
          <div className="periodic-panel-header">
            <div>
              <p className="empty-state-label">Interactive Periodic Table</p>
              <p className="periodic-panel-copy">
                Click an element to view atomic details. Star elements to save
                favorites.
              </p>
            </div>
          </div>

          <div className="periodic-wrapper">
            {filteredElements.length === 0 ? (
              <div className="empty-state empty-state-wide" role="status" aria-live="polite">
                <p className="empty-state-label">
                  {favoritesOnly ? "No favorite elements yet" : "No elements found"}
                </p>
                <h2>
                  {favoritesOnly
                    ? "Click the star on any element to save it here."
                    : "Try a different search or category filter."}
                </h2>
                <p>
                  {favoritesOnly
                    ? "Favorites stay in your browser after refresh."
                    : "The current search or category selection returned no matching elements."}
                </p>
              </div>
            ) : (
              <div className="periodic-grid-scroll">
                <div className="periodic-layout">
                  {filteredElements.map((element) => (
                    <motion.div
                      key={element.atomicnumber}
                      className={`element ${element.category
                        ?.replace(/\s+/g, "")
                        .toLowerCase()}`}
                      style={{
                        gridColumn: element.tablecolumn18col,
                        gridRow: element.tablerow18col
                      }}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedElement(element)}
                    >
                      <button
                        type="button"
                        className={`favorite-btn ${
                          favoriteSet.has(element.atomicnumber) ? "active" : ""
                        }`}
                        aria-label={`${
                          favoriteSet.has(element.atomicnumber)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        } for ${element.name}`}
                        aria-pressed={favoriteSet.has(element.atomicnumber)}
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleFavorite(element.atomicnumber)
                        }}
                      >
                        ★
                      </button>

                      <span className="number">{element.atomicnumber}</span>
                      <h2>{element.symbol}</h2>
                      <p className="name">{element.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedElement && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedElement(null)}
          >
            <motion.div
              className="modal element-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                type="button"
                aria-label="Close element details"
                onClick={() => setSelectedElement(null)}
              >
                ×
              </button>

              <div className="modal-scroll">
                <div className="modal-hero">
                  <div>
                    <p className="modal-label">
                      Atomic #{selectedElement.atomicnumber}
                    </p>

                    <h1>{selectedElement.symbol}</h1>

                    <h2>{selectedElement.name}</h2>

                    <span className="category-badge">
                      {selectedElement.category}
                    </span>
                  </div>

                  <div className="atom-visual">
                    <span></span>
                    <span></span>
                    <span></span>
                    <div className="nucleus">
                      {selectedElement.symbol}
                    </div>
                  </div>
                </div>

                <div className="quick-stats">
                  <div>
                    <span>Group</span>
                    <p>{selectedElement.group}</p>
                  </div>

                  <div>
                    <span>Period</span>
                    <p>{selectedElement.period}</p>
                  </div>

                  <div>
                    <span>Block</span>
                    <p>{selectedElement.block}</p>
                  </div>
                </div>

                <div className="info-grid">
                  <div>
                    <span>Atomic Weight</span>
                    <p>{selectedElement.atomicweight}</p>
                  </div>

                  <div>
                    <span>Standard Weight</span>
                    <p>{selectedElement.atomicweightfull}</p>
                  </div>

                  <div>
                    <span>Occurrence</span>
                    <p>{selectedElement.occurrence}</p>
                  </div>

                  <div>
                    <span>State / Origin</span>
                    <p>{selectedElement.stateofmatter}</p>
                  </div>

                  <div>
                    <span>Valence Electrons</span>
                    <p>{selectedElement.valenceElectrons}</p>
                  </div>

                  <div>
                    <span>Table Position</span>
                    <p>
                      Row {selectedElement.tablerow18col}, Column{" "}
                      {selectedElement.tablecolumn18col}
                    </p>
                  </div>

                  <div className="full">
                    <span>Electron Configuration</span>
                    <p>{selectedElement.electronConfiguration}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
