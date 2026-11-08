
import { useState, useEffect } from "react";
import "./Criaturas.css";

// API de fabricantes y modelos
const API_VEHICULOS = "https://vpic.nhtsa.dot.gov/api/vehicles";

// API de imágenes
const API_IMAGENES = "https://commons.wikimedia.org/w/api.php";

// Buscar una fotografía en Wikimedia Commons
async function buscarImagen(busqueda) {
  try {
    const parametros = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: busqueda,
      gsrnamespace: "6",
      gsrlimit: "1",
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "640",
      format: "json",
      origin: "*"
    });

    const respuesta = await fetch(
      `${API_IMAGENES}?${parametros.toString()}`
    );

    if (!respuesta.ok) {
      throw new Error("Error al buscar imagen");
    }

    const datos = await respuesta.json();
    const paginas = Object.values(datos.query?.pages || {});
    const informacion = paginas[0]?.imageinfo?.[0];

    if (!informacion) {
      return null;
    }

    return {
      imagen: informacion.thumburl || informacion.url,
      fuente: informacion.descriptionurl,
      licencia:
        informacion.extmetadata?.LicenseShortName?.value || "Consultar licencia",
      autor:
        informacion.extmetadata?.Artist?.value || "Autor no especificado"
    };

  } catch (error) {
    console.error("Error buscando imagen:", error);
    return null;
  }
}

function Criaturas() {
  const [categoria, setCategoria] = useState("car");

  const [fabricantes, setFabricantes] = useState([]);
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState("");

  const [fabricanteSeleccionado, setFabricanteSeleccionado] =
    useState(null);

  const [modelos, setModelos] = useState([]);
  const [cargandoModelos, setCargandoModelos] = useState(false);
  const [errorModelos, setErrorModelos] = useState("");

  // Obtener fabricantes e imágenes
  useEffect(() => {
    let cancelado = false;

    const obtenerFabricantes = async () => {
      try {
        setCargado(true);
        setError("");
        setFabricantes([]);
        setFabricanteSeleccionado(null);
        setModelos([]);

        const respuesta = await fetch(
          `${API_VEHICULOS}/GetMakesForVehicleType/${categoria}?format=json`
        );

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener los fabricantes");
        }

        const datos = await respuesta.json();

        const lista = (datos.Results || []).slice(0, 12);

        // Buscar fotografías de cada fabricante
        const palabra = categoria === "car" ? "car" : "motorcycle";

        const fabricantesConImagenes = await Promise.all(
          lista.map(async (fabricante) => {
            const foto = await buscarImagen(
              `${fabricante.MakeName} ${palabra}`
            );

            return {
              ...fabricante,
              foto
            };
          })
        );

        if (!cancelado) {
          setFabricantes(fabricantesConImagenes);
        }

      } catch (err) {
        if (!cancelado) {
          setError(err.message);
        }
      } finally {
        if (!cancelado) {
          setCargado(false);
        }
      }
    };

    obtenerFabricantes();

    return () => {
      cancelado = true;
    };
  }, [categoria]);

  // Obtener modelos e imágenes
  const obtenerModelos = async (fabricante) => {
    try {
      setFabricanteSeleccionado(fabricante);
      setCargandoModelos(true);
      setErrorModelos("");
      setModelos([]);

      const url = `${API_VEHICULOS}/GetModelsForMake/${encodeURIComponent(
        fabricante.MakeName
      )}?format=json`;

      const respuesta = await fetch(url);

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los modelos");
      }

      const datos = await respuesta.json();

      const lista = (datos.Results || []).slice(0, 12);

      const palabra = categoria === "car" ? "car" : "motorcycle";

      // Buscar fotografías para cada modelo
      const modelosConImagenes = await Promise.all(
        lista.map(async (modelo) => {
          const foto = await buscarImagen(
            `${fabricante.MakeName} ${modelo.Model_Name} ${palabra}`
          );

          return {
            ...modelo,
            foto
          };
        })
      );

      setModelos(modelosConImagenes);

    } catch (err) {
      setErrorModelos(err.message);
    } finally {
      setCargandoModelos(false);
    }
  };

  return (
    <div className="criaturas">

      <h1>Mundo Motor 🏎️🏍️</h1>

      <p className="criaturas-descripcion">
        Explora fabricantes y modelos de vehículos con
        fotografías e información obtenida de APIs públicas.
      </p>

      {/* Categorías */}
      <div className="categoria">

        <button
          className={categoria === "car" ? "activo" : ""}
          onClick={() => setCategoria("car")}
        >
          🏎️ Automóviles
        </button>

        <button
          className={categoria === "motorcycle" ? "activo" : ""}
          onClick={() => setCategoria("motorcycle")}
        >
          🏍️ Motocicletas
        </button>

      </div>

      {/* Cargando fabricantes */}
      {cargado && (
        <p className="criaturas-mensaje">
          🔎 Buscando fabricantes y fotografías...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="error">{error}</p>
      )}

      {/* Fabricantes */}
      {!cargado && !error && (
        <>
          <h2 className="subtitulo">
            Fabricantes disponibles
          </h2>

          <div className="criaturas-grid">

            {fabricantes.map((fabricante) => (
              <div
                className="criatura-card"
                key={fabricante.MakeId}
              >

                {fabricante.foto?.imagen ? (
                  <img
                    className="criatura-imagen"
                    src={fabricante.foto.imagen}
                    alt={fabricante.MakeName}
                    loading="lazy"
                  />
                ) : (
                  <div className="criatura-imagen sin-imagen">
                    {categoria === "car" ? "🚘" : "🏍️"}
                    <span>Imagen no disponible</span>
                  </div>
                )}

                <div className="criatura-info">

                  <small>
                    {categoria === "car"
                      ? "FABRICANTE DE AUTOMÓVILES"
                      : "FABRICANTE DE MOTOCICLETAS"}
                  </small>

                  <h3>{fabricante.MakeName}</h3>

                  <p>
                    Identificador: {fabricante.MakeId}
                  </p>

                  <button
                    className="btn-modelos"
                    onClick={() => obtenerModelos(fabricante)}
                  >
                    Ver modelos →
                  </button>

                  {fabricante.foto?.fuente && (
                    <a
                      className="enlace-fuente"
                      href={fabricante.foto.fuente}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Fuente de imagen
                    </a>
                  )}

                </div>
              </div>
            ))}

          </div>
        </>
      )}

      {/* Modelos */}
      {fabricanteSeleccionado && (
        <div className="modelos-contenedor">

          <div className="modelos-header">

            <h2>
              Modelos de {fabricanteSeleccionado.MakeName}
            </h2>

            <button
              className="btn-cerrar"
              onClick={() => {
                setFabricanteSeleccionado(null);
                setModelos([]);
                setErrorModelos("");
              }}
            >
              ✕ Cerrar
            </button>

          </div>

          {cargandoModelos && (
            <p className="criaturas-mensaje">
              🔎 Buscando modelos y fotografías...
            </p>
          )}

          {errorModelos && (
            <p className="error">{errorModelos}</p>
          )}

          {!cargandoModelos && !errorModelos && (
            <div className="modelos-grid">

              {modelos.map((modelo) => (
                <div
                  className="modelo-card"
                  key={modelo.Model_ID}
                >

                  {modelo.foto?.imagen ? (
                    <img
                      src={modelo.foto.imagen}
                      alt={modelo.Model_Name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="modelo-sin-imagen">
                      {categoria === "car" ? "🚘" : "🏍️"}
                      <span>Imagen no disponible</span>
                    </div>
                  )}

                  <div className="modelo-info">

                    <h3>{modelo.Model_Name}</h3>

                    <small>
                      ID del modelo: {modelo.Model_ID}
                    </small>

                    {modelo.foto?.fuente && (
                      <a
                        href={modelo.foto.fuente}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver fuente y licencia →
                      </a>
                    )}

                  </div>

                </div>
              ))}

              {modelos.length === 0 && (
                <p>No se encontraron modelos registrados.</p>
              )}

            </div>
          )}

        </div>
      )}

      <p className="api-fuente">
        Información: NHTSA vPIC API | Fotografías: Wikimedia Commons
      </p>

    </div>
  );
}

export default Criaturas;
