import React, { useState } from "react";
import logo from "./assets/folsetech-logo.svg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const genres = [
  "Trap",
  "Hip-Hop",
  "Pop",
  "R&B",
  "Worship",
  "EDM",
  "Rock",
  "Country",
  "Lo-Fi",
];

function App() {
  const [lyrics, setLyrics] = useState("");
  const [genre, setGenre] = useState("Trap");
  const [voiceFile, setVoiceFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [songUrl, setSongUrl] = useState(null);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSongUrl(null);
    setMeta(null);

    if (!lyrics.trim()) {
      setError("Please enter some lyrics.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("lyrics", lyrics);
      formData.append("genre", genre);
      if (voiceFile) {
        formData.append("voice_sample", voiceFile);
      }

      const res = await fetch(`${API_BASE}/api/generate-song`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Generation failed");
      }

      const fullUrl = `${API_BASE}${data.song_url}`;
      setSongUrl(fullUrl);
      setMeta(data.metadata);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2.5rem 1.5rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background:
          "radial-gradient(circle at top, #020617, #020617 40%, #000 100%)",
        color: "#f9fafb",
      }}
    >
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
        }}
      >
        {/* Header / Brand */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            marginBottom: "1.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img
              src={logo}
              alt="FolseTech AI Solutions"
              style={{
                height: "40px",
                filter: "drop-shadow(0 0 18px rgba(56,189,248,0.55))",
              }}
            />
            <div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  margin: 0,
                  letterSpacing: "0.03em",
                }}
              >
                QuickMP3 Studio
              </h1>
              <p
                style={{
                  margin: 0,
                  marginTop: "0.1rem",
                  fontSize: "0.85rem",
                  color: "#9ca3af",
                }}
              >
                FolseTech AI Solutions • Transforming ideas into intelligent tracks
              </p>
            </div>
          </div>
          <div
            style={{
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              border: "1px solid rgba(56,189,248,0.45)",
              background:
                "linear-gradient(135deg, rgba(8,47,73,0.9), rgba(15,23,42,0.9))",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#e0f2fe",
              whiteSpace: "nowrap",
            }}
          >
            River Parishes • AI Web & Audio
          </div>
        </header>

        {/* Card */}
        <div
          style={{
            padding: "2rem",
            borderRadius: "1.5rem",
            background:
              "linear-gradient(145deg, rgba(15,23,42,0.97), rgba(8,47,73,0.96))",
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.85), 0 0 0 1px rgba(30,64,175,0.55)",
            border: "1px solid rgba(15,118,110,0.45)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-20%",
              background:
                "radial-gradient(circle at 10% 0%, rgba(56,189,248,0.11), transparent 55%), radial-gradient(circle at 90% 120%, rgba(79,70,229,0.14), transparent 55%)",
              opacity: 0.85,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <p style={{ marginBottom: "1.25rem", color: "#cbd5f5" }}>
              Paste your lyrics, pick a genre, optionally drop in a short voice
              sample, and let the FolseTech pipeline craft a custom track
              demo-ready for your clients or your catalog.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "grid", gap: "1rem" }}
            >
              <div>
                <label
                  style={{ display: "block", marginBottom: "0.25rem" }}
                  htmlFor="lyrics"
                >
                  Lyrics
                </label>
                <textarea
                  id="lyrics"
                  rows={8}
                  style={{
                    width: "100%",
                    borderRadius: "0.9rem",
                    padding: "0.85rem 1rem",
                    border: "1px solid rgba(148,163,184,0.55)",
                    backgroundColor: "rgba(15,23,42,0.96)",
                    color: "#f9fafb",
                    resize: "vertical",
                    fontSize: "0.9rem",
                  }}
                  placeholder="Write or paste your lyrics here... (hooks, verses, bridges — QuickMP3 doesn’t judge)"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginTop: "0.25rem",
                }}
              >
                <div style={{ flex: "1 1 160px" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem" }}
                    htmlFor="genre"
                  >
                    Genre
                  </label>
                  <select
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: "0.9rem",
                      padding: "0.6rem 0.75rem",
                      border: "1px solid rgba(148,163,184,0.55)",
                      backgroundColor: "rgba(15,23,42,0.96)",
                      color: "#f9fafb",
                      fontSize: "0.9rem",
                    }}
                  >
                    {genres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: "1 1 220px" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem" }}
                    htmlFor="voice_sample"
                  >
                    Voice Sample (optional)
                  </label>
                  <input
                    id="voice_sample"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setVoiceFile(e.target.files?.[0] || null)}
                    style={{
                      display: "block",
                      width: "100%",
                      borderRadius: "0.9rem",
                      padding: "0.4rem",
                      border: "1px solid rgba(148,163,184,0.55)",
                      backgroundColor: "rgba(15,23,42,0.96)",
                      color: "#f9fafb",
                      fontSize: "0.85rem",
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    5–30 seconds of clean speech is ideal for voice cloning.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "0.5rem",
                  borderRadius: "999px",
                  padding: "0.8rem 1.7rem",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #22d3ee, #4f46e5, #22c55e)",
                  color: "#f9fafb",
                  fontWeight: 600,
                  cursor: loading ? "wait" : "pointer",
                  boxShadow:
                    "0 10px 30px rgba(56,189,248,0.35), 0 0 0 1px rgba(15,23,42,0.9)",
                  transform: loading ? "scale(0.99)" : "scale(1)",
                  transition:
                    "transform 0.08s ease-out, box-shadow 0.1s ease-out, filter 0.12s ease-out",
                  filter: loading ? "grayscale(0.15)" : "none",
                }}
              >
                {loading ? "Brewing your track..." : "Generate Song"}
              </button>
            </form>

            {error && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.9rem",
                  backgroundColor: "rgba(220,38,38,0.18)",
                  border: "1px solid rgba(248,113,113,0.55)",
                  color: "#fecaca",
                  fontSize: "0.9rem",
                }}
              >
                {error}
              </div>
            )}

            {songUrl && (
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid rgba(30,64,175,0.7)",
                }}
              >
                <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  Your FolseTech Render
                </h2>
                {meta && (
                  <p style={{ fontSize: "0.9rem", color: "#a5b4fc" }}>
                    Genre: <strong>{meta.genre}</strong> • Approx.{" "}
                    {meta.duration_seconds}s • Render ID: {meta.id} • Brand:{" "}
                    {meta.brand}
                  </p>
                )}
                <audio
                  controls
                  style={{
                    marginTop: "0.75rem",
                    width: "100%",
                  }}
                  src={songUrl}
                >
                  Your browser does not support the audio element.
                </audio>
                <div style={{ marginTop: "0.75rem" }}>
                  <a
                    href={songUrl}
                    download="quickmp3-song.mp3"
                    style={{
                      fontSize: "0.9rem",
                      color: "#a5b4fc",
                      textDecoration: "underline",
                    }}
                  >
                    Download MP3
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: "1.75rem",
            fontSize: "0.8rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Powered by{" "}
          <span style={{ color: "#22d3ee", fontWeight: 500 }}>
            FolseTech AI Solutions
          </span>{" "}
          • AI-Driven Web & Audio Automation for the River Parishes
        </footer>
      </div>
    </div>
  );
}

export default App;
