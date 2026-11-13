
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Vista3D() {
  const contenedorRef = useRef(null);
  const reiniciarRef = useRef(null);

  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;

    const escena = new THREE.Scene();
    escena.background = new THREE.Color("#e8edf5");

    const camara = new THREE.PerspectiveCamera(
      42,
      contenedor.clientWidth / contenedor.clientHeight,
      0.1,
      100
    );

    const posicionInicial = new THREE.Vector3(10, 8, 14);
    const objetivo = new THREE.Vector3(0, 2.2, 0);

    camara.position.copy(posicionInicial);
    camara.lookAt(objetivo);

    const renderizador = new THREE.WebGLRenderer({
      antialias: true
    });

    renderizador.setSize(
      contenedor.clientWidth,
      contenedor.clientHeight
    );

    renderizador.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderizador.shadowMap.enabled = true;
    renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
    renderizador.outputColorSpace = THREE.SRGBColorSpace;
    renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 1.3;

    contenedor.appendChild(renderizador.domElement);

    // ILUMINACIÓN GENERAL
    escena.add(
      new THREE.HemisphereLight("#ffffff", "#9ca3af", 2)
    );

    const luzPrincipal = new THREE.DirectionalLight("#fff4df", 3);
    luzPrincipal.position.set(5, 12, 8);
    luzPrincipal.castShadow = true;
    luzPrincipal.shadow.mapSize.set(1024, 1024);
    escena.add(luzPrincipal);

    // MATERIALES
    const materiales = {
      madera: new THREE.MeshStandardMaterial({
        color: "#92572f",
        roughness: 0.7
      }),
      maderaClara: new THREE.MeshStandardMaterial({
        color: "#c18a55",
        roughness: 0.65
      }),
      pared: new THREE.MeshStandardMaterial({
        color: "#fffaf0"
      }),
      suelo: new THREE.MeshStandardMaterial({
        color: "#d6c5ae",
        roughness: 0.8
      }),
      blanco: new THREE.MeshStandardMaterial({
        color: "#ffffff"
      }),
      vidrio: new THREE.MeshStandardMaterial({
        color: "#93c5fd",
        transparent: true,
        opacity: 0.28,
        roughness: 0.2
      }),
      azul: new THREE.MeshStandardMaterial({
        color: "#1d4ed8",
        roughness: 0.5
      })
    };

    // FUNCIÓN PARA CREAR CAJAS
    function caja(
      ancho,
      alto,
      fondo,
      material,
      x,
      y,
      z,
      sombra = true
    ) {
      const geometria = new THREE.BoxGeometry(
        ancho,
        alto,
        fondo
      );

      const objeto = new THREE.Mesh(geometria, material);

      objeto.position.set(x, y, z);
      objeto.castShadow = sombra;
      objeto.receiveShadow = true;

      escena.add(objeto);

      return objeto;
    }

    // SUELO
    caja(15, 0.2, 13, materiales.suelo, 0, -0.1, 0);

    // PAREDES
    caja(15, 7, 0.2, materiales.pared, 0, 3.4, -6.4);
    caja(0.2, 7, 13, materiales.pared, -7.4, 3.4, 0);

    // FRANJA SUPERIOR DE PARED
    caja(14.8, 0.15, 0.25, materiales.madera, 0, 6.8, -6.2);

    // VENTANA LATERAL
    caja(
      0.08, 2.3, 3.8,
      materiales.vidrio,
      -7.25, 3.8, -0.5
    );

    caja(
      0.15, 2.5, 0.12,
      materiales.blanco,
      -7.15, 3.8, -2.4
    );

    caja(
      0.15, 2.5, 0.12,
      materiales.blanco,
      -7.15, 3.8, 1.4
    );

    // PUERTA DE ENTRADA
    caja(
      2.1, 3.5, 0.15,
      materiales.madera,
      5.3, 1.75, -6.2
    );

    caja(
      1.75, 3.1, 0.08,
      materiales.vidrio,
      5.3, 1.8, -6.08
    );

    // MANIJA DE PUERTA
    const manija = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshStandardMaterial({ color: "#d4a017", metalness: 0.8 })
    );

    manija.position.set(4.7, 1.8, -5.98);
    escena.add(manija);

    // LETRERO PRINCIPAL
    caja(
      7.5, 1.25, 0.25,
      materiales.azul,
      0, 5.5, -6.05
    );

    function crearTexto(texto, tamaño, color, x, y, z) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 256;

      const contexto = canvas.getContext("2d");
      contexto.clearRect(0, 0, 1024, 256);
      contexto.fillStyle = color;
      contexto.font = `bold ${tamaño}px Arial`;
      contexto.textAlign = "center";
      contexto.textBaseline = "middle";
      contexto.fillText(texto, 512, 128);

      const textura = new THREE.CanvasTexture(canvas);
      textura.colorSpace = THREE.SRGBColorSpace;

      const material = new THREE.MeshBasicMaterial({
        map: textura,
        transparent: true,
        side: THREE.DoubleSide
      });

      const letrero = new THREE.Mesh(
        new THREE.PlaneGeometry(7, 1.75),
        material
      );

      letrero.position.set(x, y, z);
      escena.add(letrero);

      return letrero;
    }

    crearTexto(
      "LIBRERÍA MONTAÑO",
      105,
      "#ffffff",
      0,
      5.5,
      -5.89
    );

    // ESTANTERÍAS
    const posiciones = [-4.5, 0, 4.5];

    posiciones.forEach((x) => {
      // Laterales
      caja(0.15, 3.8, 1.15, materiales.madera, x - 1.6, 1.9, -3.9);
      caja(0.15, 3.8, 1.15, materiales.madera, x + 1.6, 1.9, -3.9);

      // Repisas
      [0.15, 1.35, 2.55, 3.75].forEach((y) => {
        caja(
          3.35,
          0.16,
          1.2,
          materiales.maderaClara,
          x,
          y,
          -3.9
        );
      });

      // Parte posterior
      caja(
        3.2,
        3.6,
        0.08,
        materiales.madera,
        x,
        1.9,
        -4.5
      );
    });

    // PRODUCTOS ESCOLARES
    const colores = [
      "#2563eb",
      "#dc2626",
      "#16a34a",
      "#eab308",
      "#9333ea",
      "#f97316"
    ];

    posiciones.forEach((x, grupo) => {
      for (let nivel = 0; nivel < 3; nivel++) {
        for (let i = 0; i < 5; i++) {
          const material = new THREE.MeshStandardMaterial({
            color: colores[(i + grupo + nivel) % colores.length],
            roughness: 0.55
          });

          const libro = caja(
            0.38,
            0.75,
            0.72,
            material,
            x - 1.25 + i * 0.53,
            0.78 + nivel * 1.2,
            -3.9
          );

          libro.rotation.z = i % 2 === 0 ? 0.04 : -0.04;
        }
      }
    });

    // MOSTRADOR
    caja(
      3.8, 1.15, 1.6,
      materiales.maderaClara,
      0, 0.6, 1.7
    );

    caja(
      4, 0.16, 1.8,
      materiales.madera,
      0, 1.25, 1.7
    );

    // DETALLES DEL MOSTRADOR
    caja(
      1.2, 0.7, 0.08,
      materiales.madera,
      0, 0.65, 2.53
    );

    // LÁPICES
    colores.forEach((color, i) => {
      const lapiz = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.9, 12),
        new THREE.MeshStandardMaterial({ color })
      );

      lapiz.position.set(-1.1 + i * 0.42, 1.85, 1.7);
      lapiz.rotation.z = 0.12;
      lapiz.castShadow = true;

      escena.add(lapiz);
    });

    // ILUMINACIÓN DECORATIVA
    for (let i = 0; i < 3; i++) {
      const luz = new THREE.PointLight("#ffdda0", 35, 8);
      luz.position.set(-4.5 + i * 4.5, 5.9, -2);
      escena.add(luz);

      const bombilla = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 16, 16),
        new THREE.MeshBasicMaterial({ color: "#ffe6a3" })
      );

      bombilla.position.copy(luz.position);
      escena.add(bombilla);
    }

    // PLANTAS DECORATIVAS
    function crearPlanta(x, z) {
      const maceta = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.25, 0.55, 16),
        new THREE.MeshStandardMaterial({ color: "#b45309" })
      );

      maceta.position.set(x, 0.28, z);
      escena.add(maceta);

      for (let i = 0; i < 5; i++) {
        const hoja = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 12, 12),
          new THREE.MeshStandardMaterial({ color: "#15803d" })
        );

        hoja.scale.set(0.7, 1.8, 0.7);
        hoja.position.set(
          x + Math.sin(i * 1.25) * 0.2,
          0.8 + (i % 2) * 0.15,
          z + Math.cos(i * 1.25) * 0.2
        );

        escena.add(hoja);
      }
    }

    crearPlanta(-5.7, 2.2);
    crearPlanta(5.7, 2.2);

    // CÁMARA INTERACTIVA
    let angulo = Math.atan2(
      posicionInicial.x,
      posicionInicial.z
    );

    let distancia = posicionInicial.length();
    let altura = posicionInicial.y;
    let arrastrando = false;
    let ultimoX = 0;
    let ultimoY = 0;

    function actualizarCamara() {
      camara.position.set(
        Math.sin(angulo) * distancia,
        altura,
        Math.cos(angulo) * distancia
      );

      camara.lookAt(objetivo);
    }

    function iniciar(evento) {
      arrastrando = true;
      ultimoX = evento.clientX;
      ultimoY = evento.clientY;
    }

    function mover(evento) {
      if (!arrastrando) return;

      angulo -= (evento.clientX - ultimoX) * 0.006;

      altura = THREE.MathUtils.clamp(
        altura + (ultimoY - evento.clientY) * 0.025,
        3,
        12
      );

      ultimoX = evento.clientX;
      ultimoY = evento.clientY;

      actualizarCamara();
    }

    function detener() {
      arrastrando = false;
    }

    function zoom(evento) {
      evento.preventDefault();

      distancia = THREE.MathUtils.clamp(
        distancia + evento.deltaY * 0.01,
        8,
        24
      );

      actualizarCamara();
    }

    const lienzo = renderizador.domElement;

    lienzo.addEventListener("pointerdown", iniciar);
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", detener);
    lienzo.addEventListener("wheel", zoom, { passive: false });

    // BOTÓN PARA RESTABLECER LA CÁMARA
    reiniciarRef.current = () => {
      angulo = Math.atan2(
        posicionInicial.x,
        posicionInicial.z
      );

      distancia = posicionInicial.length();
      altura = posicionInicial.y;

      actualizarCamara();
    };

    // AJUSTAR TAMAÑO
    function redimensionar() {
      const ancho = contenedor.clientWidth;
      const alto = contenedor.clientHeight;

      camara.aspect = ancho / alto;
      camara.updateProjectionMatrix();

      renderizador.setSize(ancho, alto);
    }

    window.addEventListener("resize", redimensionar);

    // ANIMACIÓN
    let animacion;

    function animar() {
      animacion = requestAnimationFrame(animar);
      renderizador.render(escena, camara);
    }

    animar();

    // LIMPIEZA
    return () => {
      cancelAnimationFrame(animacion);

      window.removeEventListener("resize", redimensionar);
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", detener);

      lienzo.removeEventListener("pointerdown", iniciar);
      lienzo.removeEventListener("wheel", zoom);

      escena.traverse((objeto) => {
        if (objeto.geometry) objeto.geometry.dispose();

        if (objeto.material) {
          const lista = Array.isArray(objeto.material)
            ? objeto.material
            : [objeto.material];

          lista.forEach((material) => {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        }
      });

      renderizador.dispose();

      if (contenedor.contains(lienzo)) {
        contenedor.removeChild(lienzo);
      }
    };
  }, []);

  return (
    <section className="space-y-5">

      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-sm font-bold tracking-widest text-blue-600">
            EXPERIENCIA INTERACTIVA
          </span>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            Nuestro showroom
          </h2>

          <p className="text-slate-500 mt-2">
            Conoce el espacio de Librería Montaño en tres dimensiones.
          </p>
        </div>

        <button
          onClick={() => reiniciarRef.current?.()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition"
        >
          ↻ Restablecer cámara
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center gap-3">
          <div>
            <h3 className="text-lg font-bold">
              Librería Montaño
            </h3>

            <p className="text-sm text-slate-300">
              Material escolar y artículos de oficina
            </p>
          </div>

          <span className="bg-blue-600 px-4 py-2 rounded-full text-xs font-bold">
            MODELO 3D
          </span>
        </div>

        <div
          ref={contenedorRef}
          className="w-full h-[550px] cursor-grab active:cursor-grabbing touch-none"
        />

        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap gap-5 text-sm text-slate-600">
          <span>🖱️ Arrastra para girar</span>
          <span>🔍 Rueda del mouse para acercar</span>
          <span>🏬 Explora el local</span>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-2xl">📚</span>
          <h3 className="font-bold text-slate-800 mt-2">
            Variedad de libros
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Espacios organizados para materiales educativos.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-2xl">✏️</span>
          <h3 className="font-bold text-slate-800 mt-2">
            Útiles escolares
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Productos escolares y artículos de oficina.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-2xl">🏬</span>
          <h3 className="font-bold text-slate-800 mt-2">
            Espacio comercial
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Una representación tridimensional de la librería.
          </p>
        </div>

      </div>

    </section>
  );
}
