# Conceptos Fundamentales del Desarrollo de Aplicaciones Web

**Danilo Andras Moreno Herrera**

Facultad de Ingeniería, Corporación Universitaria Iberoamericana

Electiva — Desarrollo de Aplicaciones Web

DIANA TOQUICA

23 de mayo del 2026

---

## Tabla de Contenido

1. Introducción
2. REST con Swagger
3. ReactJS
4. Hooks de React (useState, useContext, useEffect, useReducer)
5. Context API
6. Peticiones HTTP con Axios
7. Rutas y Navegación
8. Despliegue
9. Código de la Aplicación — SafeCheck
10. Referencias

---

## Introducción

El desarrollo de aplicaciones web modernas requiere el dominio de un conjunto de tecnologías y patrones arquitectónicos que permiten construir sistemas escalables, mantenibles y seguros. En el presente documento se definen y analizan los conceptos fundamentales que estructuran el ecosistema de desarrollo frontend contemporáneo: el estilo arquitectónico REST y su documentación mediante Swagger, el framework ReactJS como base de construcción de interfaces de usuario, los Hooks nativos de React para la gestión del estado y los efectos secundarios, la Context API como mecanismo de gestión de estado global, las peticiones HTTP mediante la librería Axios, el sistema de rutas y navegación del lado del cliente, y las estrategias de despliegue en entornos productivos.

Cada concepto se describe desde su definición teórica, su funcionalidad práctica y un ejemplo de implementación en código, tomando como referencia la aplicación SafeCheck, un sistema web de gestión de hallazgos de Seguridad y Salud en el Trabajo (SST) desarrollado con React y Firebase.

---

## REST con Swagger

### Definición

REST (Representational State Transfer) es un estilo de arquitectura de software para sistemas distribuidos basado en hipermedia, definido por Roy Fielding en su disertación doctoral en el año 2000. REST no es un protocolo ni un estándar, sino un conjunto de restricciones arquitectónicas que, cuando se aplican a un servicio web, producen una interfaz uniforme, eficiente y escalable (Fielding, 2000).

Un servicio que cumple los principios REST se denomina RESTful y opera sobre el protocolo HTTP, utilizando sus métodos estándar para representar operaciones sobre recursos: GET para obtener, POST para crear, PUT o PATCH para actualizar, y DELETE para eliminar.

Los seis principios fundamentales de REST son:

1. **Interfaz uniforme:** Los recursos se identifican mediante URIs y se manipulan a través de representaciones estándar.
2. **Sin estado (Stateless):** Cada petición del cliente al servidor debe contener toda la información necesaria para ser comprendida; el servidor no almacena estado de sesión del cliente.
3. **Cacheable:** Las respuestas deben indicar si son cacheables para mejorar el rendimiento.
4. **Sistema de capas:** El cliente no necesita saber si está conectado directamente al servidor final.
5. **Código bajo demanda (opcional):** El servidor puede extender la funcionalidad del cliente enviando código ejecutable.
6. **Cliente-servidor:** La separación de responsabilidades entre la interfaz de usuario y el almacenamiento de datos mejora la portabilidad.

Swagger, actualmente conocido como OpenAPI Specification, es un framework de código abierto para describir, documentar y consumir APIs RESTful. Permite generar documentación interactiva de una API a partir de su definición, facilitando tanto el desarrollo como las pruebas (OpenAPI Initiative, 2023).

### Funcionalidad

Una API REST recibe peticiones HTTP en endpoints definidos y retorna respuestas en formato JSON o XML. Swagger genera una interfaz visual en la que los desarrolladores pueden explorar y probar los endpoints directamente desde el navegador sin necesidad de herramientas externas.

### Ejemplo

A continuación se presenta la definición en formato OpenAPI 3.0 de un endpoint REST para la gestión de hallazgos SST:

```yaml
openapi: 3.0.0
info:
  title: SafeCheck API
  version: 1.0.0
paths:
  /hallazgos:
    get:
      summary: Obtener todos los hallazgos
      responses:
        '200':
          description: Lista de hallazgos
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Hallazgo'
    post:
      summary: Crear un nuevo hallazgo
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Hallazgo'
      responses:
        '201':
          description: Hallazgo creado exitosamente
components:
  schemas:
    Hallazgo:
      type: object
      properties:
        id:
          type: string
        titulo:
          type: string
        estado:
          type: string
          enum: [Abierto, En Proceso, Cerrado]
        prioridad:
          type: string
          enum: [Alta, Media, Baja]
```

En SafeCheck, el backend es sustituido por Firebase Firestore, que actúa como base de datos en la nube con acceso directo desde el cliente mediante su SDK, respetando los principios de separación de responsabilidades propios de REST.

---

## ReactJS

### Definición

React es una biblioteca de JavaScript de código abierto desarrollada por Meta (anteriormente Facebook) para construir interfaces de usuario. Fue lanzada en 2013 y se ha consolidado como una de las herramientas más utilizadas en el desarrollo frontend a nivel mundial (Meta Open Source, 2023). React adopta un modelo de programación declarativo basado en componentes reutilizables, donde la interfaz se describe como una función del estado de la aplicación.

### Funcionalidad

El núcleo de React es el Virtual DOM (Document Object Model virtual), una representación en memoria del árbol de componentes real del navegador. Cuando el estado de un componente cambia, React calcula la diferencia entre el Virtual DOM anterior y el nuevo, y actualiza únicamente los nodos del DOM real que cambiaron, lo que resulta en un rendimiento significativamente superior al de la manipulación directa del DOM (Abramov & Clark, 2015).

Los componentes React son funciones (o clases) de JavaScript que reciben datos de entrada denominados `props` y retornan elementos JSX, una extensión de sintaxis que permite escribir estructuras similares a HTML dentro de JavaScript.

### Ejemplo

En SafeCheck, cada vista de la aplicación es un componente React. El siguiente ejemplo corresponde a la estructura base de un componente funcional:

```jsx
// src/pages/Dashboard.jsx
import { useHallazgos } from "../hooks/useHallazgos";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { hallazgos, loading } = useHallazgos();

  if (loading) {
    return <div className="text-gray-500 py-8 text-center">Cargando datos...</div>;
  }

  const abiertos = hallazgos.filter((h) => h.estado === "Abierto");
  const enProceso = hallazgos.filter((h) => h.estado === "En Proceso");
  const cerrados = hallazgos.filter((h) => h.estado === "Cerrado");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard titulo="Total" valor={hallazgos.length} color="blue" />
        <StatCard titulo="Abiertos" valor={abiertos.length} color="red" />
        <StatCard titulo="En Proceso" valor={enProceso.length} color="yellow" />
        <StatCard titulo="Cerrados" valor={cerrados.length} color="green" />
      </div>
    </div>
  );
}
```

Este componente no requiere lógica de manipulación del DOM; simplemente describe qué debe mostrarse dado el estado actual de los datos, y React se encarga de actualizar la vista cuando dichos datos cambian.

---

## Hooks de React

### Definición

Los Hooks son funciones especiales introducidas en React 16.8 que permiten a los componentes funcionales acceder a características que anteriormente solo estaban disponibles en componentes de clase, como el estado local y el ciclo de vida del componente (React Team, 2019). Su nombre proviene del inglés "enganchar", haciendo referencia a que permiten "engancharse" a las capacidades internas de React.

### useState

#### Definición y Funcionalidad

`useState` es el Hook más básico de React. Permite declarar una variable de estado dentro de un componente funcional. Recibe un valor inicial y retorna un arreglo con dos elementos: el valor actual del estado y una función para actualizarlo. Cada vez que se llama a la función de actualización, React vuelve a renderizar el componente con el nuevo valor.

#### Ejemplo

En el formulario de registro de SafeCheck, `useState` gestiona cada campo del formulario y los estados de carga y error:

```jsx
// src/pages/Register.jsx
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
    rol: "inspector"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Al enviar el formulario se actualizan los estados según el resultado
}
```

### useContext

#### Definición y Funcionalidad

`useContext` permite a un componente consumir el valor de un contexto de React sin necesidad de envolver el componente en un Consumer. Acepta un objeto de contexto como argumento y retorna el valor actual de ese contexto. Es fundamental para acceder a datos globales de la aplicación como la sesión del usuario (React Team, 2019).

#### Ejemplo

En SafeCheck, `useContext` se utiliza a través del hook personalizado `useAuth` para acceder a los datos de sesión en cualquier componente:

```jsx
// src/contexts/AuthContext.jsx
export function useAuth() {
  return useContext(AuthContext);
}

// Uso en cualquier componente de la aplicación
import { useAuth } from "../contexts/AuthContext";

export default function HallazgosList() {
  const { user, rol } = useAuth(); // Accede al contexto global de autenticación

  const lista =
    rol === "inspector"
      ? hallazgos.filter((h) => h.reportadoPor === user.uid)
      : hallazgos;
}
```

### useEffect

#### Definición y Funcionalidad

`useEffect` permite ejecutar efectos secundarios en componentes funcionales. Un efecto secundario es cualquier operación que interactúa con el mundo fuera del flujo de renderizado de React: peticiones de red, suscripciones, manipulación del DOM, entre otros. Acepta una función de efecto y un arreglo de dependencias que determina cuándo debe ejecutarse el efecto (React Team, 2019).

#### Ejemplo

En SafeCheck, `useEffect` se utiliza en el `AuthContext` para suscribirse a los cambios de estado de autenticación de Firebase y actualizar el estado global cuando el usuario inicia o cierra sesión:

```jsx
// src/contexts/AuthContext.jsx
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        const data = snap.exists() ? snap.data() : {};
        setUser(firebaseUser);
        setRol(data.rol || null);
        setUserData(data);
      } catch {
        setUser(firebaseUser);
        setRol(null);
        setUserData(null);
      }
    } else {
      setUser(null);
      setRol(null);
      setUserData(null);
    }
    setLoading(false);
  });
  return unsubscribe; // Limpieza: se cancela la suscripción al desmontar
}, []); // Arreglo vacío: se ejecuta solo una vez al montar
```

### useReducer

#### Definición y Funcionalidad

`useReducer` es una alternativa a `useState` para gestionar estados complejos que involucran múltiples subvalores o cuando el próximo estado depende del anterior. Sigue el patrón de Redux: recibe una función reductora (que define cómo el estado cambia en respuesta a acciones) y un estado inicial, y retorna el estado actual junto con una función `dispatch` para enviar acciones (React Team, 2019).

#### Ejemplo

A continuación se presenta un ejemplo ilustrativo de cómo se podría gestionar el estado de un formulario de hallazgo con `useReducer`, permitiendo manejar múltiples campos y estados de manera centralizada:

```jsx
import { useReducer } from "react";

const initialState = {
  titulo: "",
  descripcion: "",
  ubicacion: "",
  categoria: "",
  prioridad: "",
  loading: false,
  error: "",
};

function hallazgoReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET_ERROR":
      return { ...state, error: action.message };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function NuevoHallazgoConReducer() {
  const [state, dispatch] = useReducer(hallazgoReducer, initialState);

  const handleChange = (e) =>
    dispatch({ type: "SET_FIELD", field: e.target.name, value: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", value: true });
    try {
      // lógica de guardado
      dispatch({ type: "RESET" });
    } catch {
      dispatch({ type: "SET_ERROR", message: "Error al guardar." });
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };
}
```

---

## Context API

### Definición

La Context API es una característica nativa de React que proporciona una forma de pasar datos a través del árbol de componentes sin necesidad de hacerlo manualmente mediante `props` en cada nivel (propagación de props o "prop drilling"). Fue estabilizada en React 16.3 y permite crear un "almacén" global de datos accesible por cualquier componente de la aplicación (Meta Open Source, 2023).

### Funcionalidad

La Context API opera con tres elementos fundamentales:

- **`React.createContext(valorPorDefecto)`:** Crea el objeto de contexto.
- **`Context.Provider`:** Componente que envuelve el árbol y suministra el valor del contexto a todos sus descendientes.
- **`useContext(Context)`:** Hook que consume el valor del contexto en cualquier componente descendiente.

Su principal caso de uso es la gestión de estado global de la aplicación: sesión de usuario, tema visual, idioma, preferencias, entre otros.

### Ejemplo

En SafeCheck, la Context API gestiona la autenticación global. El `AuthContext` expone el usuario, el rol, los datos del perfil y las funciones `login`, `register` y `logout` a toda la aplicación:

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          const data = snap.exists() ? snap.data() : {};
          setUser(firebaseUser);
          setRol(data.rol || null);
          setUserData(data);
        } catch {
          setUser(firebaseUser);
          setRol(null);
          setUserData(null);
        }
      } else {
        setUser(null);
        setRol(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password, nombre, rol = "inspector") => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await setDoc(doc(db, "users", user.uid), {
        nombre,
        email,
        rol,
        creadoEn: serverTimestamp(),
      });
    } catch (firestoreError) {
      await user.delete();
      throw firestoreError;
    }
    return user;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, rol, userData, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

El `AuthProvider` envuelve toda la aplicación en `src/main.jsx`, haciendo que los valores del contexto estén disponibles en cualquier componente sin necesidad de pasar `props` manualmente.

---

## Peticiones HTTP con Axios

### Definición

Axios es una biblioteca de JavaScript basada en Promesas para realizar peticiones HTTP tanto desde el navegador como desde Node.js. Está construida sobre la API `XMLHttpRequest` del navegador y proporciona una interfaz más limpia y completa que la API nativa `fetch` (Axios, 2023). Su amplia adopción en el ecosistema de React se debe a características como la intercepción de peticiones y respuestas, la transformación automática de datos JSON, la cancelación de peticiones y el manejo centralizado de errores.

### Funcionalidad

Axios permite realizar los métodos HTTP estándar (`get`, `post`, `put`, `patch`, `delete`) de forma sencilla. Soporta la configuración de instancias con una URL base y cabeceras predeterminadas, lo que facilita la integración con APIs RESTful que requieren autenticación mediante tokens.

### Ejemplo

A continuación se presenta un ejemplo de cómo se integraría Axios en una aplicación que consumiera una API REST externa para gestionar hallazgos. Aunque SafeCheck utiliza directamente el SDK de Firebase (que abstrae la comunicación HTTP), el patrón sería equivalente si se conectara a una API RESTful:

```jsx
// Instalación: npm install axios

import axios from "axios";

// Instancia configurada con la URL base y token de autenticación
const api = axios.create({
  baseURL: "https://api.safecheck.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Función para obtener todos los hallazgos
export async function getHallazgos() {
  const { data } = await api.get("/hallazgos");
  return data;
}

// Función para crear un nuevo hallazgo
export async function crearHallazgo(hallazgo) {
  const { data } = await api.post("/hallazgos", hallazgo);
  return data;
}

// Función para actualizar el estado de un hallazgo
export async function actualizarEstado(id, nuevoEstado) {
  const { data } = await api.patch(`/hallazgos/${id}`, { estado: nuevoEstado });
  return data;
}

// Uso dentro de un componente React con useEffect
import { useState, useEffect } from "react";

export default function ListaHallazgos() {
  const [hallazgos, setHallazgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHallazgos()
      .then(setHallazgos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;
  return (
    <ul>
      {hallazgos.map((h) => (
        <li key={h.id}>{h.titulo} — {h.estado}</li>
      ))}
    </ul>
  );
}
```

---

## Rutas y Navegación

### Definición

La navegación en una Single Page Application (SPA) se gestiona en el lado del cliente, sin recargas completas del navegador. React Router DOM es la biblioteca estándar del ecosistema React para implementar este tipo de navegación declarativa (Remix Software, 2023). En lugar de solicitar cada página al servidor, React Router intercepta los cambios de URL y renderiza el componente correspondiente.

### Funcionalidad

React Router DOM expone los siguientes componentes y hooks principales:

- **`BrowserRouter`:** Envuelve la aplicación y habilita la navegación basada en la History API del navegador.
- **`Routes` y `Route`:** Definen el árbol de rutas y el componente que se renderiza para cada path.
- **`Navigate`:** Redirige programáticamente a otra ruta.
- **`Link`:** Equivalente al elemento `<a>` de HTML pero sin recargar la página.
- **`useNavigate`:** Hook que retorna una función para navegar programáticamente.
- **`useParams`:** Hook que retorna los parámetros dinámicos de la URL actual.

### Ejemplo

En SafeCheck, la configuración de rutas se centraliza en `src/App.jsx`. Se utilizan rutas protegidas que verifican la autenticación y el rol del usuario antes de renderizar el componente correspondiente:

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HallazgosList from "./pages/HallazgosList";
import NewHallazgo from "./pages/NewHallazgo";
import HallazgoDetail from "./pages/HallazgoDetail";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas: requieren autenticación */}
          <Route
            path="/hallazgos"
            element={
              <ProtectedRoute>
                <Layout><HallazgosList /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hallazgos/nuevo"
            element={
              <ProtectedRoute>
                <Layout><NewHallazgo /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hallazgos/:id"
            element={
              <ProtectedRoute>
                <Layout><HallazgoDetail /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Ruta restringida por rol: solo supervisor y admin */}
          <Route
            path="/dashboard"
            element={
              <RoleRoute roles={["supervisor", "admin"]}>
                <Layout><Dashboard /></Layout>
              </RoleRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

Las rutas protegidas se implementan mediante componentes wrapper que verifican el estado de autenticación y el rol antes de renderizar el contenido:

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RoleRoute({ children, roles }) {
  const { user, rol, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(rol)) return <Navigate to="/" replace />;
  return children;
}
```

---

## Despliegue

### Definición

El despliegue (deployment) es el proceso de publicar una aplicación en un entorno accesible para los usuarios finales a través de internet. Para aplicaciones React, el despliegue implica generar una versión optimizada del código (build de producción) y alojarla en un servidor o servicio de hosting estático (Netlify, 2023).

### Funcionalidad

Vite, el bundler utilizado en SafeCheck, compila todos los archivos fuente (JSX, CSS, imágenes) en un conjunto de archivos estáticos optimizados mediante el comando `npm run build`. El resultado se almacena en la carpeta `dist/` y puede ser servido por cualquier servidor HTTP o CDN.

Las plataformas más utilizadas para el despliegue de aplicaciones React son:

- **Firebase Hosting:** Hosting estático global con CDN integrada, desarrollado por Google, con integración nativa con Firebase Authentication y Firestore.
- **Vercel:** Plataforma especializada en el despliegue de aplicaciones frontend, con despliegue automático desde repositorios Git.
- **Netlify:** Similar a Vercel, con soporte para funciones serverless y despliegue continuo.

### Ejemplo

El proceso de despliegue de SafeCheck en Firebase Hosting es el siguiente:

**Paso 1 — Instalar Firebase CLI:**

```bash
npm install -g firebase-tools
```

**Paso 2 — Autenticarse con Firebase:**

```bash
firebase login
```

**Paso 3 — Inicializar Firebase Hosting en el proyecto:**

```bash
firebase init hosting
```

Durante la inicialización se configura:
- Directorio público: `dist`
- Configurar como SPA (reescribir todas las rutas a `index.html`): sí

**Paso 4 — Generar el build de producción:**

```bash
npm run build
```

**Paso 5 — Desplegar:**

```bash
firebase deploy --only hosting
```

El archivo `firebase.json` resultante de la configuración tiene la siguiente estructura:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

La regla `rewrites` es fundamental para las SPAs: garantiza que al acceder directamente a cualquier ruta (por ejemplo, `/hallazgos/abc123`), el servidor sirva `index.html` y React Router se encargue de la navegación en el cliente.

---

## Código de la Aplicación — SafeCheck

SafeCheck es una aplicación web de gestión de hallazgos de Seguridad y Salud en el Trabajo (SST). A continuación se presenta el código fuente completo de los módulos principales de la aplicación.

### Configuración de Firebase

```jsx
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

Las credenciales se almacenan en un archivo `.env` local (excluido del repositorio mediante `.gitignore`) y se exponen al código a través de `import.meta.env`, la API de variables de entorno de Vite.

### Hook de Hallazgos

```jsx
// src/hooks/useHallazgos.js
import { useState, useEffect } from "react";
import {
  collection, getDocs, getDoc, addDoc, updateDoc,
  doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export function useHallazgos() {
  const [hallazgos, setHallazgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHallazgos = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "hallazgos"), orderBy("fechaCreacion", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setHallazgos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHallazgos(); }, []);
  return { hallazgos, loading, error, refetch: fetchHallazgos };
}

export async function getHallazgo(id) {
  const snap = await getDoc(doc(db, "hallazgos", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function crearHallazgo(datos, uid) {
  const hallazgo = {
    ...datos,
    estado: "Abierto",
    reportadoPor: uid,
    responsable: null,
    accionCorrectiva: null,
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp(),
    fechaCierre: null,
    historial: [{
      estado: "Abierto",
      usuario: uid,
      fecha: new Date().toISOString(),
      nota: "Hallazgo creado",
    }],
  };
  const ref = await addDoc(collection(db, "hallazgos"), hallazgo);
  return ref.id;
}

export async function avanzarEstado(id, nuevoEstado, uid, nota, extras = {}) {
  const ref = doc(db, "hallazgos", id);
  const snap = await getDoc(ref);
  const data = snap.data();
  const nuevaEntrada = {
    estado: nuevoEstado,
    usuario: uid,
    fecha: new Date().toISOString(),
    nota,
  };
  const update = {
    estado: nuevoEstado,
    fechaActualizacion: serverTimestamp(),
    historial: [...(data.historial || []), nuevaEntrada],
    ...extras,
  };
  if (nuevoEstado === "Cerrado") update.fechaCierre = serverTimestamp();
  await updateDoc(ref, update);
}
```

### Página de Login

```jsx
// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/hallazgos");
    } catch {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-700">SafeCheck</h1>
          <p className="text-gray-500 text-sm mt-1">Gestión SST</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="usuario@empresa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm
                            rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                       text-white font-medium py-2 rounded-lg transition-colors text-sm"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### Página de Registro

```jsx
// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "", email: "", password: "", confirmar: "", rol: "inspector"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nombre || !form.email || !form.password || !form.confirmar) {
      setError("Completa todos los campos.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.nombre, form.rol);
      navigate("/hallazgos");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado.");
      } else {
        setError("Error al crear la cuenta. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-700">SafeCheck</h1>
          <p className="text-gray-500 text-sm mt-1">Crear cuenta</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["nombre", "email", "password", "confirmar"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field === "nombre" ? "Nombre completo"
                  : field === "confirmar" ? "Confirmar contraseña"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field.includes("password") || field === "confirmar"
                  ? "password" : field === "email" ? "email" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="inspector">Inspector</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm
                            rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                       text-white font-medium py-2 rounded-lg transition-colors text-sm"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### Listado de Hallazgos

```jsx
// src/pages/HallazgosList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHallazgos } from "../hooks/useHallazgos";
import { useAuth } from "../contexts/AuthContext";
import EstadoBadge from "../components/EstadoBadge";
import PrioridadBadge from "../components/PrioridadBadge";

export default function HallazgosList() {
  const { hallazgos, loading } = useHallazgos();
  const { rol, user } = useAuth();
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");

  const lista =
    rol === "inspector"
      ? hallazgos.filter((h) => h.reportadoPor === user.uid)
      : hallazgos;

  const filtradas = lista.filter((h) => {
    const porEstado = filtroEstado === "Todos" || h.estado === filtroEstado;
    const porPrioridad =
      filtroPrioridad === "Todas" || h.prioridad === filtroPrioridad;
    return porEstado && porPrioridad;
  });

  const formatFecha = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("es-CO", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Hallazgos</h1>
        <Link
          to="/hallazgos/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm
                     font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Nuevo hallazgo
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {["Todos", "Abierto", "En Proceso", "Cerrado"].map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Prioridad</label>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {["Todas", "Alta", "Media", "Baja"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-gray-500 text-center py-8">Cargando hallazgos...</div>
      ) : filtradas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
          No hay hallazgos con los filtros seleccionados.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Título</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Prioridad</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtradas.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      to={`/hallazgos/${h.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {h.titulo}
                    </Link>
                    <div className="text-gray-400 text-xs mt-0.5">{h.ubicacion}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {h.categoria}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <PrioridadBadge prioridad={h.prioridad} />
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={h.estado} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {formatFecha(h.fechaCreacion)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

---

## Referencias

Abramov, D., & Clark, P. (2015). *React: Rethinking best practices*. Facebook Engineering Blog.

Axios. (2023). *Axios documentation*. https://axios-http.com/docs/intro

Fielding, R. T. (2000). *Architectural styles and the design of network-based software architectures* [Tesis doctoral, University of California, Irvine]. https://ics.uci.edu/~fielding/pubs/dissertation/top.htm

Meta Open Source. (2023). *React – A JavaScript library for building user interfaces*. https://react.dev

Netlify. (2023). *Deploy React apps on Netlify*. https://docs.netlify.com

OpenAPI Initiative. (2023). *OpenAPI specification 3.1.0*. https://spec.openapis.org/oas/v3.1.0

React Team. (2019). *Introducing Hooks*. https://legacy.reactjs.org/docs/hooks-intro.html

Remix Software. (2023). *React Router documentation*. https://reactrouter.com/en/main
