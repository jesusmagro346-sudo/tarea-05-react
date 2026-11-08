import { useState, useEffect } from "react";
import "./Noticias.css";

function Noticias() {
  const [noticia, setNoticias] = useState([]);
  const [categoria, setCategoria] = useState("general");
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState("");
  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

  useEffect(() => {
    const obtenerNoticias = async () => {
      try {
        setCargado(true);
        setError("");
        const url = `https://gnews.io/api/v4/top-headlines?category=${categoria}&lang=es&country=pe&max=10&apikey=${API_KEY}`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar las noticias");
        }
        setNoticias(datos.articles || []);
      } catch (err) {
        setError(err.message);
        setNoticias([]);
      } finally {
        setCargado(false);
      }
    };
    obtenerNoticias();
  }, [categoria]);

  return (
    <div className="noticias">
      <h1>Últimas noticias 📰</h1>
      <div className="categoria">
        <button onClick={() => setCategoria("general")}>🌍 General</button>
        <button onClick={() => setCategoria("technology")}>
          🧑‍💻 Tecnología
        </button>
        <button onClick={() => setCategoria("sports")}>🏐 Deportes</button>
      </div>
      {cargado && <p>Cargando noticias...</p>}
      {error && <p className="error">{error}</p>}
      {!cargado && !error && (
        <div>
          {noticia.map((noticia, i) => (
            <div className="noticias-card" key={noticia.url || i}>
              <img
                src={
                  noticia.image || "https://placehold.co/600x400?text=Noticia"
                }
                alt={noticia.title}
              />
              <div className="noticia-info">
                <small>{noticia.source?.name}</small>
                <h3>{noticia.title}</h3>
                <p>{noticia.description}</p>
                <a href={noticia.url} target="_blank" rel="noneferrer">
                  Leer más ...
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Noticias;
