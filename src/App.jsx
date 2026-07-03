import { useState } from "react"
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

  const filteredElements = elements.filter((element) => {
    const query = search.toLowerCase()

    const matchesSearch =
      element.name?.toLowerCase().includes(query) ||
      element.symbol?.toLowerCase().includes(query) ||
      String(element.atomicnumber).includes(query)

    const matchesCategory =
      categoryFilter === "All" ||
      element.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand-copy">
          <p className="brand-label">Chemistry Hub Mini Tool</p>
          <h1>Periodic Table</h1>
          <p className="brand-subtitle">
            Explore elements, categories, and atomic properties in one
            interactive table.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search element..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <section className="filters">
        {categories.map((category) => (
          <button
            key={category}
            className={categoryFilter === category ? "active" : ""}
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="periodic-wrapper">
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
              <span className="number">{element.atomicnumber}</span>
              <h2>{element.symbol}</h2>
              <p className="name">{element.name}</p>
            </motion.div>
          ))}
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
                onClick={() => setSelectedElement(null)}
              >
                ×
              </button>

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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
