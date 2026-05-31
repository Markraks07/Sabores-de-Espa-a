// =============================================
// DATOS INICIALES DEL MENÚ
// =============================================
const menuInicial = [
    { id: 1, nombre: 'Jamón Ibérico', categoria: 'entrantes', precio: 18, descripcion: 'Jamón ibérico de bellota con pan tostado y tomate.', alergenos: ['gluten'] },
    { id: 2, nombre: 'Camarones al Ajillo', categoria: 'entrantes', precio: 14, descripcion: 'Camarones frescos salteados con ajo y aceite de oliva.', alergenos: ['mariscos'] },
    { id: 3, nombre: 'Tabla de Quesos', categoria: 'entrantes', precio: 16, descripcion: 'Selección de quesos españoles variados con mermelada.', alergenos: ['lactosa'] },
    { id: 4, nombre: 'Croquetas Caseras', categoria: 'entrantes', precio: 10, descripcion: 'Croquetas de jamón y bechamel. Receta de la abuela.', alergenos: ['gluten', 'lactosa'] },
    { id: 5, nombre: 'Paella Valenciana', categoria: 'principales', precio: 22, descripcion: 'Arroz con pollo, conejo y judías verdes. Receta tradicional.', alergenos: [] },
    { id: 6, nombre: 'Rabo de Toro', categoria: 'principales', precio: 20, descripcion: 'Guiso de rabo de toro con garbanzos y verduras.', alergenos: [] },
    { id: 7, nombre: 'Cordero Lechal Asado', categoria: 'principales', precio: 25, descripcion: 'Cordero asado lentamente en horno de leña con hierbas.', alergenos: [] },
    { id: 8, nombre: 'Bacalao a la Vizcaína', categoria: 'principales', precio: 21, descripcion: 'Bacalao desalado con salsa de pimentón y cebolla.', alergenos: ['mariscos'] },
    { id: 9, nombre: 'Flan Casero', categoria: 'postres', precio: 7, descripcion: 'Flan tradicional con caramelo crujiente artesanal.', alergenos: ['lactosa'] },
    { id: 10, nombre: 'Tarta de Santiago', categoria: 'postres', precio: 7, descripcion: 'Tarta gallega de almendra con azúcar glasé.', alergenos: ['frutos-secos'] },
    { id: 11, nombre: 'Torrijas', categoria: 'postres', precio: 8, descripcion: 'Torrijas caseras con miel de flores y canela.', alergenos: ['gluten', 'lactosa'] },
    { id: 12, nombre: 'Vino Tinto Rioja', categoria: 'bebidas', precio: 5, descripcion: 'Copa de vino tinto Rioja Reserva.', alergenos: [] },
    { id: 13, nombre: 'Agua Mineral', categoria: 'bebidas', precio: 2, descripcion: 'Botella de agua mineral natural o con gas.', alergenos: [] },
    { id: 14, nombre: 'Sangría Casera', categoria: 'bebidas', precio: 8, descripcion: 'Sangría elaborada con vino, frutas y especias.', alergenos: [] },
];

// =============================================
// INICIALIZACIÓN DE DATOS
// =============================================
function inicializarDatos() {
    if (!localStorage.getItem('restaurante_menu')) {
        localStorage.setItem('restaurante_menu', JSON.stringify(menuInicial));
    }
    if (!localStorage.getItem('restaurante_reservas')) {
        localStorage.setItem('restaurante_reservas', JSON.stringify([]));
    }
    if (!localStorage.getItem('restaurante_resenas')) {
        localStorage.setItem('restaurante_resenas', JSON.stringify([]));
    }
}

function getMenu() { return JSON.parse(localStorage.getItem('restaurante_menu')) || []; }
function getReservas() { return JSON.parse(localStorage.getItem('restaurante_reservas')) || []; }
function getResenas() { return JSON.parse(localStorage.getItem('restaurante_resenas')) || []; }
function guardarMenu(menu) { localStorage.setItem('restaurante_menu', JSON.stringify(menu)); }
function guardarReservas(r) { localStorage.setItem('restaurante_reservas', JSON.stringify(r)); }
function guardarResenas(r) { localStorage.setItem('restaurante_resenas', JSON.stringify(r)); }

// =============================================
// MENÚ HAMBURGUESA
// =============================================
const hamburguesa = document.getElementById('menu-hamburguesa');
const navMenu = document.getElementById('nav-menu');

if (hamburguesa) {
    hamburguesa.addEventListener('click', () => {
        hamburguesa.classList.toggle('activo');
        navMenu.classList.toggle('activo');
    });
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburguesa.classList.remove('activo');
            navMenu.classList.remove('activo');
        });
    });
}

// =============================================
// SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// =============================================
// MENÚ INTERACTIVO
// =============================================
let filtroActual = 'todos';
let alergenosExcluidos = [];

function renderMenu() {
    const grid = document.getElementById('platos-grid');
    if (!grid) return;

    const menu = getMenu();

    const filtrados = menu.filter(plato => {
        const categoriaOk = filtroActual === 'todos' || plato.categoria === filtroActual;
        const alergenoOk = alergenosExcluidos.every(a => !plato.alergenos.includes(a));
        return categoriaOk && alergenoOk;
    });

    if (filtrados.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#999;padding:40px;grid-column:1/-1">No hay platos con estos filtros.</p>';
        return;
    }

    grid.innerHTML = filtrados.map(plato => `
        <div class="plato-card">
            <div class="plato-header">
                <span class="plato-nombre">${plato.nombre}</span>
                <span class="plato-precio">${plato.precio}€</span>
            </div>
            <p class="plato-desc">${plato.descripcion}</p>
            <div class="plato-alergenos">
                ${plato.alergenos.map(a => `<span class="alergeno-tag">⚠️ ${a}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Filtros de categoría
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        filtroActual = btn.getAttribute('data-filtro');
        renderMenu();
    });
});

// Filtros de alérgenos
document.querySelectorAll('[data-alergeno]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        alergenosExcluidos = Array.from(document.querySelectorAll('[data-alergeno]:checked'))
            .map(c => c.getAttribute('data-alergeno'));
        renderMenu();
    });
});

// =============================================
// STATS DEL HERO
// =============================================
function actualizarStats() {
    const reservas = getReservas();
    const resenas = getResenas();

    const statReservas = document.getElementById('stat-reservas');
    const statResenas = document.getElementById('stat-resenas');
    const statValoracion = document.getElementById('stat-valoracion');

    if (statReservas) statReservas.textContent = reservas.length;
    if (statResenas) statResenas.textContent = resenas.length;
    if (statValoracion) {
        if (resenas.length > 0) {
            const media = resenas.reduce((a, r) => a + r.estrellas, 0) / resenas.length;
            statValoracion.textContent = '⭐ ' + media.toFixed(1);
        } else {
            statValoracion.textContent = '⭐ -';
        }
    }
}

// =============================================
// RESERVAS
// =============================================
const formReserva = document.getElementById('form-reserva');
if (formReserva) {
    // Fecha mínima = hoy
    const fechaInput = document.getElementById('res-fecha');
    if (fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.min = hoy;
    }

    formReserva.addEventListener('submit', e => {
        e.preventDefault();

        const nueva = {
            id: Date.now(),
            nombre: document.getElementById('res-nombre').value,
            email: document.getElementById('res-email').value,
            telefono: document.getElementById('res-telefono').value,
            personas: document.getElementById('res-personas').value,
            fecha: document.getElementById('res-fecha').value,
            hora: document.getElementById('res-hora').value,
            ocasion: document.getElementById('res-ocasion').value,
            observaciones: document.getElementById('res-observaciones').value,
            estado: 'pendiente',
            fechaCreacion: new Date().toLocaleDateString('es-ES')
        };

        const reservas = getReservas();
        reservas.push(nueva);
        guardarReservas(reservas);

        formReserva.reset();
        actualizarStats();

        // Modal confirmación
        document.getElementById('modal-texto').textContent =
            `¡Hola ${nueva.nombre}! Tu mesa para ${nueva.personas} persona(s) el ${nueva.fecha} a las ${nueva.hora} está reservada. Te confirmaremos por email.`;
        document.getElementById('modal-confirmacion').style.display = 'flex';
    });
}

function cerrarModal() {
    document.getElementById('modal-confirmacion').style.display = 'none';
}

// =============================================
// RESEÑAS
// =============================================
let estrellasSeleccionadas = 0;

const estrellasInput = document.querySelectorAll('.estrella');
if (estrellasInput.length > 0) {
    estrellasInput.forEach(estrella => {
        estrella.addEventListener('mouseover', () => {
            const valor = parseInt(estrella.getAttribute('data-valor'));
            estrellasInput.forEach((e, i) => {
                e.textContent = i < valor ? '★' : '☆';
                e.style.color = i < valor ? '#f4d03f' : '#ddd';
            });
        });

        estrella.addEventListener('mouseout', () => {
            estrellasInput.forEach((e, i) => {
                e.textContent = i < estrellasSeleccionadas ? '★' : '☆';
                e.style.color = i < estrellasSeleccionadas ? '#f4d03f' : '#ddd';
            });
        });

        estrella.addEventListener('click', () => {
            estrellasSeleccionadas = parseInt(estrella.getAttribute('data-valor'));
            document.getElementById('res-estrellas').value = estrellasSeleccionadas;
        });
    });
}

function renderResenas() {
    const lista = document.getElementById('resenas-lista');
    const resumen = document.getElementById('resenas-resumen');
    if (!lista) return;

    const resenas = getResenas();

    // Resumen
    if (resumen) {
        if (resenas.length === 0) {
            resumen.innerHTML = '<p style="text-align:center;color:#999">Sé el primero en dejar una reseña.</p>';
        } else {
            const media = resenas.reduce((a, r) => a + r.estrellas, 0) / resenas.length;
            const conteo = [5,4,3,2,1].map(n => resenas.filter(r => r.estrellas === n).length);

            resumen.innerHTML = `
                <div class="resumen-nota-grande">
                    <div class="nota">${media.toFixed(1)}</div>
                    <div class="estrellas">${'★'.repeat(Math.round(media))}${'☆'.repeat(5 - Math.round(media))}</div>
                    <p>${resenas.length} reseña(s)</p>
                </div>
                <div class="barras-valoracion">
                    ${[5,4,3,2,1].map((n, i) => `
                        <div class="barra-row">
                            <span>${n}★</span>
                            <div class="barra-bg">
                                <div class="barra-fill" style="width:${resenas.length ? (conteo[i]/resenas.length*100) : 0}%"></div>
                            </div>
                            <span>${conteo[i]}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Lista
    if (resenas.length === 0) {
        lista.innerHTML = '<p style="text-align:center;color:#999;padding:20px">No hay reseñas aún.</p>';
        return;
    }

    lista.innerHTML = [...resenas].reverse().map(r => `
        <div class="resena-card">
            <div class="resena-header">
                <span class="resena-nombre">${r.nombre}</span>
                <span class="resena-estrellas">${'★'.repeat(r.estrellas)}${'☆'.repeat(5-r.estrellas)}</span>
                <span class="resena-fecha">${r.fecha}</span>
            </div>
            <p class="resena-comentario">${r.comentario}</p>
        </div>
    `).join('');
}

const formResena = document.getElementById('form-resena');
if (formResena) {
    formResena.addEventListener('submit', e => {
        e.preventDefault();
        if (estrellasSeleccionadas === 0) {
            alert('Por favor selecciona una valoración');
            return;
        }
        const nueva = {
            id: Date.now(),
            nombre: document.getElementById('res-nombre-resena').value,
            estrellas: estrellasSeleccionadas,
            comentario: document.getElementById('res-comentario').value,
            fecha: new Date().toLocaleDateString('es-ES')
        };
        const resenas = getResenas();
        resenas.push(nueva);
        guardarResenas(resenas);
        formResena.reset();
        estrellasSeleccionadas = 0;
        estrellasInput.forEach(e => { e.textContent = '☆'; e.style.color = '#ddd'; });
        renderResenas();
        actualizarStats();
    });
}

// =============================================
// ADMIN - LOGIN
// =============================================
const ADMIN_USUARIO = 'admin';
const ADMIN_PASSWORD = '1234';

const formLogin = document.getElementById('form-login');
if (formLogin) {
    // Comprueba si ya está logueado
    if (sessionStorage.getItem('admin_logueado') === 'true') {
        mostrarPanel();
    }

    formLogin.addEventListener('submit', e => {
        e.preventDefault();
        const usuario = document.getElementById('login-usuario').value;
        const password = document.getElementById('login-password').value;

        if (usuario === ADMIN_USUARIO && password === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_logueado', 'true');
            sessionStorage.setItem('admin_usuario', usuario);
            mostrarPanel();
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    });
}

function mostrarPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    const nombre = sessionStorage.getItem('admin_usuario') || 'Admin';
    const el = document.getElementById('admin-usuario-nombre');
    if (el) el.textContent = '👤 ' + nombre;
    cargarDashboard();
    cargarTablaReservas();
    cargarTablaResenas();
    cargarTablaMenu();
}

function cerrarSesion() {
    sessionStorage.removeItem('admin_logueado');
    sessionStorage.removeItem('admin_usuario');
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
}

// =============================================
// ADMIN - NAV
// =============================================
document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('activo'));
        document.querySelectorAll('.admin-seccion').forEach(s => s.classList.remove('activo'));
        btn.classList.add('activo');
        document.getElementById('seccion-' + btn.getAttribute('data-seccion')).classList.add('activo');
    });
});

// =============================================
// ADMIN - DASHBOARD
// =============================================
function cargarDashboard() {
    const reservas = getReservas();
    const resenas = getResenas();

    document.getElementById('dash-total-reservas').textContent = reservas.length;
    document.getElementById('dash-reservas-pendientes').textContent = reservas.filter(r => r.estado === 'pendiente').length;
    document.getElementById('dash-reservas-confirmadas').textContent = reservas.filter(r => r.estado === 'confirmada').length;
    document.getElementById('dash-total-resenas').textContent = resenas.length;
    document.getElementById('dash-total-personas').textContent = reservas.reduce((a, r) => a + (parseInt(r.personas) || 0), 0);

    const media = resenas.length ? (resenas.reduce((a, r) => a + r.estrellas, 0) / resenas.length).toFixed(1) : '-';
    document.getElementById('dash-valoracion').textContent = media + (media !== '-' ? ' ★' : '');

    // Próximas reservas
    const proximas = document.getElementById('proximas-reservas');
    const proximasData = reservas.slice(-5).reverse();
    proximas.innerHTML = proximasData.length === 0
        ? '<p style="color:#999">No hay reservas aún</p>'
        : proximasData.map(r => `
            <div class="mini-reserva">
                <strong>${r.nombre}</strong> - ${r.fecha} ${r.hora} - ${r.personas} pers.
                <span class="badge badge-${r.estado}">${r.estado}</span>
            </div>
        `).join('');

    // Últimas reseñas
    const ultimas = document.getElementById('ultimas-resenas');
    const ultimasData = resenas.slice(-5).reverse();
    ultimas.innerHTML = ultimasData.length === 0
        ? '<p style="color:#999">No hay reseñas aún</p>'
        : ultimasData.map(r => `
            <div class="mini-resena">
                <strong>${r.nombre}</strong> - ${'★'.repeat(r.estrellas)}
                <br><small>${r.comentario.substring(0, 60)}...</small>
            </div>
        `).join('');

    // Gráfico por día de la semana
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const conteo = [0, 0, 0, 0, 0, 0, 0];
    reservas.forEach(r => {
        const d = new Date(r.fecha);
        if (!isNaN(d)) conteo[d.getDay()]++;
    });
    const max = Math.max(...conteo, 1);
    const grafico = document.getElementById('grafico-dias');
    grafico.innerHTML = dias.map((dia, i) => `
        <div class="barra-dia">
            <span class="barra-dia-num">${conteo[i]}</span>
            <div class="barra-dia-fill" style="height:${(conteo[i]/max*100)}%"></div>
            <span class="barra-dia-label">${dia}</span>
        </div>
    `).join('');
}

// =============================================
// ADMIN - RESERVAS
// =============================================
function cargarTablaReservas() {
    const reservas = getReservas();
    const tbody = document.getElementById('tbody-reservas');
    if (!tbody) return;

    const filtroEstado = document.getElementById('filtro-estado-reserva')?.value || 'todas';
    const filtroFecha = document.getElementById('filtro-fecha-reserva')?.value || '';

    const filtradas = reservas.filter(r => {
        const estadoOk = filtroEstado === 'todas' || r.estado === filtroEstado;
        const fechaOk = !filtroFecha || r.fecha === filtroFecha;
        return estadoOk && fechaOk;
    });

    tbody.innerHTML = filtradas.length === 0
        ? '<tr><td colspan="8" style="text-align:center;color:#999;padding:20px">No hay reservas</td></tr>'
        : filtradas.reverse().map(r => `
            <tr>
                <td><strong>${r.nombre}</strong><br><small>${r.email}</small></td>
                <td>${r.fecha}</td>
                <td>${r.hora}</td>
                <td>${r.personas}</td>
                <td>${r.telefono}</td>
                <td>${r.ocasion || '-'}</td>
                <td><span class="badge badge-${r.estado}">${r.estado}</span></td>
                <td>
                    <div class="acciones-btns">
                        ${r.estado !== 'confirmada' ? `<button class="btn btn-sm btn-success" onclick="cambiarEstadoReserva(${r.id}, 'confirmada')">✅</button>` : ''}
                        ${r.estado !== 'cancelada' ? `<button class="btn btn-sm btn-danger" onclick="cambiarEstadoReserva(${r.id}, 'cancelada')">❌</button>` : ''}
                        <button class="btn btn-sm btn-danger" onclick="eliminarReserva(${r.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
}

function cambiarEstadoReserva(id, estado) {
    const reservas = getReservas().map(r => r.id === id ? {...r, estado} : r);
    guardarReservas(reservas);
    cargarTablaReservas();
    cargarDashboard();
}

function eliminarReserva(id) {
    if (!confirm('¿Eliminar esta reserva?')) return;
    guardarReservas(getReservas().filter(r => r.id !== id));
    cargarTablaReservas();
    cargarDashboard();
}

function limpiarFiltrosReservas() {
    document.getElementById('filtro-estado-reserva').value = 'todas';
    document.getElementById('filtro-fecha-reserva').value = '';
    cargarTablaReservas();
}

// Eventos filtros reservas
document.getElementById('filtro-estado-reserva')?.addEventListener('change', cargarTablaReservas);
document.getElementById('filtro-fecha-reserva')?.addEventListener('change', cargarTablaReservas);

// =============================================
// ADMIN - RESEÑAS
// =============================================
function cargarTablaResenas() {
    const resenas = getResenas();
    const tbody = document.getElementById('tbody-resenas');
    if (!tbody) return;

    tbody.innerHTML = resenas.length === 0
        ? '<tr><td colspan="5" style="text-align:center;color:#999;padding:20px">No hay reseñas</td></tr>'
        : [...resenas].reverse().map(r => `
            <tr>
                <td><strong>${r.nombre}</strong></td>
                <td>${'★'.repeat(r.estrellas)}${'☆'.repeat(5-r.estrellas)}</td>
                <td>${r.comentario}</td>
                <td>${r.fecha}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="eliminarResena(${r.id})">🗑️ Eliminar</button>
                </td>
            </tr>
        `).join('');
}

function eliminarResena(id) {
    if (!confirm('¿Eliminar esta reseña?')) return;
    guardarResenas(getResenas().filter(r => r.id !== id));
    cargarTablaResenas();
    cargarDashboard();
}

// =============================================
// ADMIN - MENÚ
// =============================================
function cargarTablaMenu() {
    const menu = getMenu();
    const tbody = document.getElementById('tbody-menu');
    if (!tbody) return;

    tbody.innerHTML = menu.length === 0
        ? '<tr><td colspan="5" style="text-align:center;color:#999;padding:20px">No hay platos</td></tr>'
        : menu.map(p => `
            <tr>
                <td><strong>${p.nombre}</strong><br><small>${p.descripcion.substring(0, 50)}...</small></td>
                <td>${p.categoria}</td>
                <td>${p.precio}€</td>
                <td>${p.alergenos.map(a => `<span class="alergeno-tag">⚠️ ${a}</span>`).join(' ') || '-'}</td>
                <td>
                    <div class="acciones-btns">
                        <button class="btn btn-sm btn-secondary" onclick="editarPlato(${p.id})">✏️ Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarPlato(${p.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
}

function abrirModalPlato(id = null) {
    document.getElementById('modal-plato').style.display = 'flex';
    document.getElementById('form-plato').reset();
    document.querySelectorAll('[name="alergeno"]').forEach(c => c.checked = false);

    if (id) {
        const plato = getMenu().find(p => p.id === id);
        if (plato) {
            document.getElementById('modal-plato-titulo').textContent = 'Editar Plato';
            document.getElementById('plato-id').value = plato.id;
            document.getElementById('plato-nombre').value = plato.nombre;
            document.getElementById('plato-categoria').value = plato.categoria;
            document.getElementById('plato-precio').value = plato.precio;
            document.getElementById('plato-descripcion').value = plato.descripcion;
            document.querySelectorAll('[name="alergeno"]').forEach(c => {
                c.checked = plato.alergenos.includes(c.value);
            });
        }
    } else {
        document.getElementById('modal-plato-titulo').textContent = 'Añadir Plato';
        document.getElementById('plato-id').value = '';
    }
}

function editarPlato(id) { abrirModalPlato(id); }

function cerrarModalPlato() {
    document.getElementById('modal-plato').style.display = 'none';
}

function eliminarPlato(id) {
    if (!confirm('¿Eliminar este plato?')) return;
    guardarMenu(getMenu().filter(p => p.id !== id));
    cargarTablaMenu();
}

const formPlato = document.getElementById('form-plato');
if (formPlato) {
    formPlato.addEventListener('submit', e => {
        e.preventDefault();
        const id = document.getElementById('plato-id').value;
        const alergenos = Array.from(document.querySelectorAll('[name="alergeno"]:checked')).map(c => c.value);
        const plato = {
            id: id ? parseInt(id) : Date.now(),
            nombre: document.getElementById('plato-nombre').value,
            categoria: document.getElementById('plato-categoria').value,
            precio: parseFloat(document.getElementById('plato-precio').value),
            descripcion: document.getElementById('plato-descripcion').value,
            alergenos
        };
        const menu = getMenu();
        if (id) {
            const idx = menu.findIndex(p => p.id === parseInt(id));
            menu[idx] = plato;
        } else {
            menu.push(plato);
        }
        guardarMenu(menu);
        cerrarModalPlato();
        cargarTablaMenu();
    });
}

// Cerrar modales al click fuera
window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// =============================================
// INICIAR TODO
// =============================================
inicializarDatos();
renderMenu();
renderResenas();
actualizarStats();

console.log('✅ Restaurante cargado correctamente');