import { useState, useEffect } from "react";
import "./Perros.css";

function Perros() {
  const [imagenes, setImagenes] = useState([]);
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState("");
  const [recargar, setRecargar] = useState(0);

  useEffect(() => {
    const obtenerPerros = async () => {
      try {
        setCargado(true);
        setError("");

        const url = "https://dog.ceo/api/breeds/image/random/10";
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (!respuesta.ok || datos.status !== "success") {
          throw new Error("No se pudieron cargar las imágenes");
        }

        setImagenes(datos.message || []);
      } catch (err) {
        setError(err.message);
        setImagenes([]);
      } finally {
        setCargado(false);
      }
    };

    obtenerPerros();
  }, [recargar]);

  return (
    <div className="perros">
      <h1>Galería de Perritos 🐶</h1>

      <div className="categoria">
        <button onClick={() => setRecargar(prev => prev + 1)}>
          🔄 Ver otros perritos
        </button>
      </div>

      {cargado && <p>Buscando perritos amigables...</p>}

      {error && <p className="error">{error}</p>}

      {!cargado && !error && (
        <div className="perros-grid">
          {imagenes.map((urlImagen, i) => {
            const partesUrl = urlImagen.split("/");
            const razaInversa = partesUrl[partesUrl.length - 2];
            const raza = razaInversa
              ? razaInversa.replace("-", " ")
              : "Perrito";

            return (
              <div className="noticias-card" key={urlImagen || i}>
                <img
                  src={urlImagen}
                  alt={`Un hermoso ${raza}`}
                />

                <div className="noticia-info">
                  <small>Raza aproximada</small>
                  <h3 style={{ textTransform: "capitalize" }}>
                    {raza}
                  </h3>
                  <p>
                    ¡Un compañero ideal listo para alegrarte el día!
                  </p>
                  <a
                    href={urlImagen}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver imagen completa →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Perros;
