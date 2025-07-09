// Función para hacer peticiones HTTP
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en fetchData:', error);
    throw error;
  }
}

// Función para subir archivos con FormData
async function uploadFile(url, formData) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      // Extraer mensaje de error del servidor si está disponible
      const serverMessage = responseData.error || responseData.message || '';
      throw new Error(`Error del servidor: ${response.status} - ${serverMessage}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error detallado en uploadFile:', {
      error: error.message,
      stack: error.stack
    });
    throw new Error(error.message.includes('Error del servidor') 
      ? error.message 
      : 'Error al comunicarse con el servidor. Por favor intente nuevamente.');
  }
}

function hayUsuarioLogueado() {
  const authData = localStorage.getItem('auth');
  return authData && JSON.parse(authData).isLoggedIn;
}

// Función para renderizar todos los proyectos
async function renderizarProyectos() {
  const contenedor = document.getElementById('contenedor-proyectos');
  contenedor.innerHTML = '<p>Cargando proyectos...</p>';
  
  const usuarioAutenticado = hayUsuarioLogueado();

  try {
    const proyectos = await fetchData('/api/proyectos');
    
    if (proyectos.length === 0) {
      contenedor.innerHTML = '<p class="sin-proyectos">No hay proyectos aún.</p>';
      return;
    }

    contenedor.innerHTML = '';
    
    proyectos.forEach(proyecto => {
      // Crear URL para el archivo binario
      const blob = new Blob([new Uint8Array(proyecto.archivo.data)], { type: proyecto.mime_type });
      const mediaUrl = URL.createObjectURL(blob);

      let mediaContent = '';
      if (proyecto.tipo === 'imagen') {
        mediaContent = `
          <div class="contenedor-imagen">
            <img src="${mediaUrl}" alt="${proyecto.titulo}">
          </div>
        `;
      } else if (proyecto.tipo === 'audio') {
        mediaContent = `
          <div class="reproductor-audio">
            <h4>${proyecto.titulo}</h4>
            <audio id="audio-${proyecto.id}" src="${mediaUrl}"></audio>
            <div class="controles-audio">
              <button class="boton-reproducir" onclick="toggleReproduccion(${proyecto.id})">▶</button>
              <div class="barra-progreso" onclick="saltarAudio(event, ${proyecto.id})">
                <div class="progreso" id="progreso-${proyecto.id}"></div>
              </div>
              <span class="tiempo-audio" id="tiempo-${proyecto.id}">0:00 / 0:00</span>
            </div>
          </div>
        `;
      }
      
      //Solo incluir botones si hay usuario logueado
      const botonesEdicion = usuarioAutenticado ? `
        <div class="acciones-proyecto">
          <button class="boton boton-editar" onclick="editarProyecto(${proyecto.id})">Editar</button>
          <button class="boton boton-eliminar" onclick="eliminarProyecto(${proyecto.id})">Eliminar</button>
        </div>
      ` : '';

      const proyectoElement = document.createElement('div');
      proyectoElement.className = 'proyecto-container';
      proyectoElement.id = `proyecto-${proyecto.id}`;
      proyectoElement.innerHTML = `
        <div class="proyecto-media">
          ${mediaContent}
        </div>
        <div class="proyecto-explicacion">
          <h3>${proyecto.titulo}</h3>
          <p>${proyecto.descripcion}</p>
          ${botonesEdicion}
        </div>
      `;

      contenedor.appendChild(proyectoElement);

      if (proyecto.tipo === 'audio') {
        inicializarReproductor(proyecto.id);
      }
    });
  } catch (error) {
    contenedor.innerHTML = '<p class="error">Error al cargar los proyectos. Por favor, recarga la página.</p>';
    console.error('Error en renderizarProyectos:', error);
  }
}

async function agregarProyecto() {
  // Obtener elementos del DOM
  const tituloInput = document.getElementById('nuevo-titulo');
  const descripcionInput = document.getElementById('nueva-descripcion');
  const archivoInput = document.getElementById('nuevo-archivo');
  const botonSubmit = document.getElementById('btn-agregar');
  
  // Guardar estado original del botón
  let textoOriginal = 'Agregar Proyecto';
  if (botonSubmit) {
    textoOriginal = botonSubmit.textContent;
    botonSubmit.disabled = true;
    botonSubmit.textContent = 'Enviando...';
  }

  try {
    // Validar campos
    const titulo = tituloInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const tipo = document.querySelector('input[name="tipo-archivo"]:checked')?.value;
    const archivo = archivoInput.files?.[0];

    const errores = [];
    if (!titulo) errores.push('Por favor ingrese un título para el proyecto');
    if (!descripcion) errores.push('Por favor ingrese una descripción');
    if (!tipo) errores.push('Por favor seleccione un tipo de archivo');
    if (!archivo) errores.push('Por favor seleccione un archivo');

    if (errores.length > 0) {
      alert(errores.join('\n'));
      return;
    }

    // Crear FormData
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('tipo', tipo);
    formData.append('archivo', archivo);

    console.log('Datos a enviar:', {
      titulo,
      descripcion,
      tipo,
      archivo: {
        name: archivo.name,
        type: archivo.type,
        size: `${(archivo.size / 1024 / 1024).toFixed(2)} MB`
      }
    });

    // Enviar datos
    const resultado = await uploadFile('/api/proyectos', formData);
    console.log('Respuesta del servidor:', resultado);

    // Limpiar formulario
    tituloInput.value = '';
    descripcionInput.value = '';
    archivoInput.value = '';
    const radioSeleccionado = document.querySelector('input[name="tipo-archivo"]:checked');
    if (radioSeleccionado) radioSeleccionado.checked = false;

    alert('¡Proyecto creado exitosamente!');
    await renderizarProyectos();
  } catch (error) {
    console.error('Error completo:', error);
    
    let mensajeError = 'Error al crear el proyecto';
    if (error.message.includes('400')) {
      mensajeError = 'Error: El archivo no cumple con los requisitos (tamaño o tipo no permitido)';
    } else if (error.message.includes('network')) {
      mensajeError = 'Error de conexión. Verifique su internet e intente nuevamente';
    }
    
    alert(mensajeError);
  } finally {
    // Restaurar botón
    if (botonSubmit) {
      botonSubmit.disabled = false;
      botonSubmit.textContent = textoOriginal;
    }
  }
}

// Función auxiliar para mostrar notificaciones (puedes implementarla como prefieras)
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Implementación básica - puedes usar Toast, SweetAlert, etc.
  const estilos = {
    success: 'background: #4CAF50; color: white; padding: 10px;',
    error: 'background: #F44336; color: white; padding: 10px;',
    info: 'background: #2196F3; color: white; padding: 10px;'
  };
  
  const notificacion = document.createElement('div');
  notificacion.style = estilos[tipo] || estilos.info;
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 5000);
}

// Función para editar un proyecto
async function editarProyecto(id) {
  try {
    const proyecto = await fetchData(`/api/proyectos/${id}`);
    const contenedor = document.getElementById(`proyecto-${id}`);

    // Convertir el archivo binario a URL
    const blob = new Blob([new Uint8Array(proyecto.archivo.data)], { type: proyecto.mime_type });
    const mediaUrl = URL.createObjectURL(blob);

    let mediaContent = '';
    if (proyecto.tipo === 'imagen') {
      mediaContent = `
        <div class="contenedor-imagen">
          <img class="imagen-editable" src="${mediaUrl}" alt="${proyecto.titulo}" style="max-width: 100%; max-height: 200px;">
          <input type="file" id="editar-archivo-${id}" accept="image/*" style="margin-top: 10px;">
        </div>
      `;
    } else {
      mediaContent = `
        <audio controls src="${mediaUrl}"></audio>
        <input type="file" id="editar-archivo-${id}" accept="audio/*" style="margin-top: 10px;">
      `;
    }

    contenedor.innerHTML = `
      <div class="proyecto-media">
        ${mediaContent}
      </div>
      <div class="proyecto-explicacion">
        <input type="text" id="editar-titulo-${id}" value="${proyecto.titulo}">
        <textarea id="editar-descripcion-${id}">${proyecto.descripcion}</textarea>
        <div class="acciones-proyecto">
          <button class="boton boton-guardar" onclick="guardarEdicion(${id})">Guardar</button>
          <button class="boton boton-cancelar" onclick="renderizarProyectos()">Cancelar</button>
        </div>
      </div>
    `;

    // Limpiar la URL del objeto cuando se cierre la edición
    const cancelarBtn = contenedor.querySelector('.boton-cancelar');
    cancelarBtn.addEventListener('click', () => {
      URL.revokeObjectURL(mediaUrl);
    });

  } catch (error) {
    alert('Error al cargar el proyecto para editar: ' + error.message);
    console.error(error);
  }
}

// Función para guardar los cambios de edición
async function guardarEdicion(id) {
  const titulo = document.getElementById(`editar-titulo-${id}`).value.trim();
  const descripcion = document.getElementById(`editar-descripcion-${id}`).value.trim();
  const archivoInput = document.getElementById(`editar-archivo-${id}`);

  if (!titulo || !descripcion) {
    alert('Por favor complete todos los campos');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    
    // Obtener el tipo del proyecto original
    const proyectoOriginal = await fetchData(`/api/proyectos/${id}`);
    formData.append('tipo', proyectoOriginal.tipo);
    
    if (archivoInput.files && archivoInput.files[0]) {
      formData.append('archivo', archivoInput.files[0]);
    }

    await fetch(`/api/proyectos/${id}`, {
      method: 'PUT',
      body: formData
    });

    await renderizarProyectos();
  } catch (error) {
    alert('Error al actualizar el proyecto: ' + error.message);
    console.error(error);
  }
}

// Función para eliminar un proyecto
async function eliminarProyecto(id) {
  if (confirm('¿Está seguro que desea eliminar este proyecto?')) {
    try {
      await fetchData(`/api/proyectos/${id}`, {
        method: 'DELETE'
      });
      await renderizarProyectos();
    } catch (error) {
      alert('Error al eliminar el proyecto: ' + error.message);
      console.error(error);
    }
  }
}

// Funciones para el reproductor de audio (se mantienen igual)
function inicializarReproductor(id) {
  const audio = document.getElementById(`audio-${id}`);
  const progreso = document.getElementById(`progreso-${id}`);
  const tiempo = document.getElementById(`tiempo-${id}`);

  audio.addEventListener('timeupdate', () => {
    const porcentaje = (audio.currentTime / audio.duration) * 100;
    progreso.style.width = `${porcentaje}%`;
    
    const minutosActual = Math.floor(audio.currentTime / 60);
    const segundosActual = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
    const minutosTotal = Math.floor(audio.duration / 60);
    const segundosTotal = Math.floor(audio.duration % 60).toString().padStart(2, '0');
    
    tiempo.textContent = `${minutosActual}:${segundosActual} / ${minutosTotal}:${segundosTotal}`;
  });

  audio.addEventListener('ended', () => {
    progreso.style.width = '0%';
    tiempo.textContent = `0:00 / ${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60).toString().padStart(2, '0')}`;
  });
}

function toggleReproduccion(id) {
  const audio = document.getElementById(`audio-${id}`);
  const boton = document.querySelector(`#proyecto-${id} .boton-reproducir`);
  
  if (audio.paused) {
    audio.play();
    boton.textContent = '❚❚';
  } else {
    audio.pause();
    boton.textContent = '▶';
  }
}

function saltarAudio(event, id) {
  const audio = document.getElementById(`audio-${id}`);
  const barra = event.currentTarget;
  const posicion = (event.clientX - barra.getBoundingClientRect().left) / barra.offsetWidth;
  
  audio.currentTime = posicion * audio.duration;
}

// Inicializar la visualización al cargar la página
// Inicializar la visualización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticación inmediatamente
  const estaLogueado = hayUsuarioLogueado();
  
  // Obtener elementos
  const seccionAgregar = document.getElementById('seccion-agregar-proyecto');
  const formAgregar = document.getElementById('form-agregar-proyecto');
  
  // Controlar visibilidad
  if (seccionAgregar) {
    seccionAgregar.style.display = estaLogueado ? 'block' : 'none';
    seccionAgregar.classList.toggle('hidden', !estaLogueado);
  }
  
  if (formAgregar) {
    formAgregar.style.display = estaLogueado ? 'block' : 'none';
    formAgregar.classList.toggle('hidden', !estaLogueado);
  }

  // 3. Renderizar proyectos
  renderizarProyectos();
  
  // 4. Configurar evento Enter solo si está logueado
  if (estaLogueado) {
    const descripcionInput = document.getElementById('nueva-descripcion');
    if (descripcionInput) {
      descripcionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          agregarProyecto();
        }
      });
    }
  }
});