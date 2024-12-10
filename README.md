# **AgilUC - Sistema de Gestión de Inventarios**

Este proyecto es un sistema de gestión de inventarios diseñado para optimizar el préstamo y la administración de herramientas y recursos en entornos universitarios o empresariales. Se desarrolla bajo los lineamientos de ÁgilUC, implementando mejores prácticas en desarrollo ágil.

## **Características Principales**

- **Administración de Inventarios:** Gestión de herramientas con funcionalidades para agregar, editar y consultar.
- **Préstamos:** Solicitud, aprobación y rechazo de préstamos.
- **Gestión de Usuarios:** Control de acceso basado en roles (admin y estudiante).
- **Frontend Moderno:** Interfaz intuitiva desarrollada con React y Tailwind CSS.
- **Backend Escalable:** Construido con FastAPI y SQLModel para un manejo eficiente de datos.

---

## **Estructura del Proyecto**

### **Backend**

El backend se encuentra en la carpeta `api` y está desarrollado con:

- **FastAPI:** Framework principal.
- **SQLAlchemy y SQLModel:** ORM para la gestión de datos.
- **Pytest:** Para pruebas unitarias.

### **Frontend**

El frontend está en la carpeta `frontend` y utiliza:

- **React:** Framework de desarrollo de interfaz.
- **Vite:** Herramienta de empaquetado y desarrollo.
- **Tailwind CSS:** Framework de diseño.

---

## **Requisitos**

### **Backend**

- **Python 3.12+**
- Dependencias listadas en `requirements.txt`:
  ```bash
  pip install -r requirements.txt
  ```

### **Frontend**

- **Node.js 18+**
- Dependencias listadas en `package.json`:
  ```bash
  npm install
  ```

---

## **Instalación y Configuración**

### **Backend**

1. Clona el repositorio:
   ```bash
   git clone https://github.com/juanhenaoparra/geology-inventory.git
   cd api
   ```
2. Crea un entorno virtual y activa:
   ```bash
   python -m venv venv
   source venv/bin/activate # En Windows: venv\Scripts\activate
   ```
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Configura las variables de entorno en `.env` (basado en `.env.example`).

5. Ejecuta el servidor:
   ```bash
   uvicorn main:app --reload
   ```

### **Frontend**

1. Dirígete a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables en el archivo `.env`.
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run start
   ```

---

## **Uso**

### **Roles**

- **Admin:**
  - Agregar y administrar herramientas.
  - Consultar todos los préstamos.
- **Estudiante:**
  - Consultar inventario y realizar solicitudes de préstamo.

### **Acceso**

- Página de inicio: [http://localhost:3000](http://localhost:3000)

---

## **Estructura de Carpetas**

```
├── api
│   ├── main.py
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── tests
│   └── database.py
└── frontend
    ├── src
    │   ├── components
    │   ├── services
    │   ├── assets
    │   ├── styles
    │   └── globalStates
    ├── public
    └── index.html
```

---

## **Pruebas**

### **Backend**

Las pruebas están en `api/tests`:

```bash
pytest
```

### **Frontend**

Ejecución de pruebas:

```bash
npm run test
```

---

## **Contribución**

1. Crea un fork del repositorio.
2. Crea una rama para tus cambios:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza un pull request.

---

## **Contacto**

Desarrollado por:

- Juan Sebastián Henao Parra
- Marlon Stiven Aristizábal Herrera
- Yonier Vásquez Marín
- Jerónimo Toro Calvo

Documentación adicional se encuentra en la carpeta `/docs`.
