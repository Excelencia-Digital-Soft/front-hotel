<template>
	<div class="father w-full flex justify-center items-center">
		<div class="container  backdrop-filter backdrop-blur-md bg-opacity-30"
			:class="{ 'right-panel-active': isSignUp }" id="container">
			<div class="form-container sign-up-container">
				<form action="#">
					<h1 class="text-xl text-white tracking-wider">¡Crea tu cuenta!</h1>
					<input class="w-full mt-8 relative  text-sm colors-input-login my-2" type="text"
						placeholder="UserName" v-model="registerUserName" />
					<input class="w-full relative  text-sm colors-input-login my-2" type="text" placeholder="Email"
						v-model="registerEmail" />
					<input class="w-full relative  text-sm colors-input-login my-2" type="text" placeholder="Name"
						v-model="registerName" />
					<input class="w-full  relative text-sm colors-input-login my-2" type="password"
						placeholder="Contraseña" v-model="registerPassword" />
					<input class="w-full relative text-sm colors-input-login mt-2 mb-6" type="password"
						placeholder="Repetir constraseña" v-model="registerRepeatPass" />
					<input class="w-full relative text-sm colors-input-login my-2" type="number"
						placeholder="ID de Institución" v-model="registerInstitucionId" />
					<button class="btn-login-style w-full flex justify-center items-center text-md h-12 border-2"
						@click.prevent="registerUser">
						Crear nueva cuenta</button>
				</form>
			</div>
			<div class="form-container sign-in-container">
				<form action="#">
					<h1 class="text-2xl text-white tracking-wider">¡Bienvenido!</h1>
					<input class="w-full mt-8 text-sm relative colors-input-login my-2" type="text"
						placeholder="Ingresa tu Usuario" v-model="username" />
					<input class="w-full text-sm relative colors-input-login my-2" type="password"
						placeholder="Ingresa tu contraseña" v-model="password" />
					<a class="text-xs" href="#">¿Olvidaste tu contraseña?</a>
					<button
						class="relative btn-login-style w-full flex justify-center items-center text-md h-12 border-2"
						@click.prevent="authUser" :disabled="isLoading">
						<div class="card absolute top-2 right-8">
							<ProgressSpinner class="absolute " v-if="isLoading" style="width: 25px; height: 25px"
								strokeWidth="8" fill="transparent" animationDuration=".5s"
								aria-label="Custom ProgressSpinner" />
						</div>

						Iniciar Sesión
					</button>
					<!-- Modal para seleccionar institución -->
					<div v-if="showInstitucionModal"
						class="absolute institucionModalSelector inset-0 bg-black bg-opacity-50 flex justify-center items-center">
						<div class="bg-white p-6 rounded-lg">
							<h2 class="text-xl font-bold mb-4">Selecciona una institución</h2>
							<ul>
								<li v-for="institucion in authStore.instituciones" :key="institucion.institucionId"
									class="mb-2">
									<button @click="selectInstitucion(institucion.institucionId)"
										class="w-full text-left p-2 hover:bg-gray-100">
										{{ institucion.nombre }}
									</button>
								</li>
							</ul>
						</div>
					</div>
				</form>
			</div>
			<div class="overlay-container">
				<div class="overlay bg-primary-700 backdrop-filter backdrop-blur-md bg-opacity-30">
					<div class="overlay-panel text-white overlay-left ">
						<h1>Bienvenido de vuelta!</h1>
						<p>Para mantenerse conectado con nosotros, inicie sesión con su información personal</p>
						<button @click="togglePanel"
							class="flex items-center cursor-pointer  px-5 h-12 border-2 btn-switch" id="signIn">
							Iniciar sesión</button>
					</div>
					<div class="overlay-panel overlay-right">
						<div alt="MOTEL X" class="h-1/4 flex text-white lexend text-[50px] font-bold">inROOM<img
								src="../assets/pin.png" class="h-16 invert" alt=""></div>
						<button @click="togglePanel"
							class="btn-switch  flex items-center cursor-pointer  px-5 h-12 border-2 mt-8" id="signUp">
							Crear nueva cuenta</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup> 

import { ref } from 'vue'; // Solo ref para los campos de formulario individuales
import { useAuthStore } from '@/stores/auth'; // Ajusta la ruta si es diferente
import { useRouter } from 'vue-router';
import ProgressSpinner from 'primevue/progressspinner'; // Asumo que está configurado
import axiosClient from '../axiosClient'; // Para la función registerUser

const router = useRouter();
const authStore = useAuthStore();

const isSignUp = ref(false);
const isLoading = ref(false);
const loginError = ref('');
const registerError = ref('');

// --- Estado para el formulario de Login (usando ref individuales para coincidir con tu template) ---
const username = ref(''); // Coincide con v-model="username"
const password = ref(''); // Coincide con v-model="password"

// --- Estado para el formulario de Registro (usando ref individuales para coincidir con tu template) ---
const registerUserName = ref('');    // Coincide con v-model="registerUserName"
const registerEmail = ref('');       // Coincide con v-model="registerEmail"
const registerName = ref('');        // Coincide con v-model="registerName"
const registerPassword = ref('');    // Coincide con v-model="registerPassword"
const registerRepeatPass = ref('');  // Coincide con v-model="registerRepeatPass"
const registerInstitucionId = ref(null); // Coincide con v-model.number="registerInstitucionId"

const showInstitucionModal = ref(false);

// LOGIN
const authUser = async () => {
    if (isLoading.value) return;
    isLoading.value = true;
    loginError.value = '';

    try {
        const credentials = {
            nombreUsuario: username.value, // Usar .value con ref
            contraseña: password.value,   // Usar .value con ref
        };

        const loginResult = await authStore.login(credentials);

        if (loginResult && loginResult.success) {
			console.log('GuestLayout: Login en store fue exitoso.');
    		console.log('GuestLayout: authStore.isAuthenticated AHORA ES:', authStore.isAuthenticated);
    		console.log('GuestLayout: authStore.getInstitucionIDActiva AHORA ES:', authStore.getInstitucionIDActiva);
    		console.log('GuestLayout: authStore.getAvailableInstituciones AHORA SON:', authStore.getAvailableInstituciones);
            console.log("Login API call successful in authUser, checking institutions...");

            const institucionesDisponibles = authStore.getAvailableInstituciones; // Usa el getter
            
            console.log("Instituciones disponibles en GuestLayout:", institucionesDisponibles);
            console.log("InstitucionIDActiva desde store (getter):", authStore.getInstitucionIDActiva);


            if (institucionesDisponibles && institucionesDisponibles.length > 1 && authStore.getInstitucionIDActiva === null) {
                // Múltiples instituciones y NINGUNA activa por defecto en el token (el backend debería idealmente setear una)
                // O si la lógica de negocio requiere que el usuario siempre seleccione si tiene más de una.
                console.log("Múltiples instituciones y ninguna activa por defecto en token, mostrando modal.");
                showInstitucionModal.value = true;
            } else if (institucionesDisponibles && (institucionesDisponibles.length === 1 || authStore.getInstitucionIDActiva !== null)) {
                // Caso: Solo una institución O ya hay una institución activa en el token.
                console.log("Una institución o una activa en token, redirigiendo a Home...");
                if (institucionesDisponibles.length === 1 && authStore.getUiSelectedInstitucionId !== institucionesDisponibles[0].institucionId) {
                    // Si solo hay una, y no está seleccionada en la UI (o la selección es diferente), la seleccionamos.
                    // Esto también es manejado por el getter getUiSelectedInstitucionId si uiSelectedInstitucionId es null.
                    authStore.selectInstitucionForUI(institucionesDisponibles[0].institucionId);
                } else if (authStore.getInstitucionIDActiva && authStore.getUiSelectedInstitucionId !== authStore.getInstitucionIDActiva) {
                    // Si hay una activa en el token y no está seleccionada en la UI, la seleccionamos.
                     authStore.selectInstitucionForUI(authStore.getInstitucionIDActiva);
                }
     			console.log("GuestLayout: (Después de nextTick) authStore.isAuthenticated:", authStore.isAuthenticated);
    			console.log("GuestLayout: Redirigiendo a Home...");
	            router.push({ name: 'Home' }); // Usar nombre de ruta es más robusto
            } else {
                // Caso: Login exitoso pero 0 instituciones o no se pudo determinar una activa.
                // Esto es un estado problemático si la app requiere una institución.
                console.warn("Login exitoso pero no hay instituciones disponibles o no se pudo determinar una institución activa.");
                loginError.value = 'Login exitoso, pero no tiene instituciones asignadas o no se pudo determinar una para esta sesión. Contacte al administrador.';
                // Podrías considerar desloguear al usuario si este estado no es válido para continuar.
                // await authStore.logout(); 
            }
        }
        // No es necesario un 'else' aquí porque authStore.login debe lanzar un error en caso de fallo de API o credenciales.
    } catch (error) {
        console.error('Error en la función authUser (GuestLayout):', error);
        loginError.value = error.message || 'Error de autenticación. Verifique sus credenciales o intente más tarde.';
    } finally {
        isLoading.value = false;
    }
};

const handleSelectInstitucion = (institucionId) => {
    authStore.selectInstitucionForUI(institucionId);
    showInstitucionModal.value = false;
    console.log("Institución seleccionada para UI:", authStore.getUiSelectedInstitucionId);
    router.push({ name: 'Home' });
};

const cancelInstitucionSelection = () => {
    showInstitucionModal.value = false;
    loginError.value = "Debe seleccionar una institución para continuar.";
    // Considera si es apropiado hacer logout o simplemente dejar al usuario en la página de login.
    // authStore.logout(); 
};

const registerUser = async () => {
    registerError.value = '';
    if (registerPassword.value !== registerRepeatPass.value) {
        registerError.value = 'Las contraseñas no coinciden.';
        return;
    }
    if (registerInstitucionId.value === null || registerInstitucionId.value <= 0) {
        registerError.value = 'Por favor, ingresa un ID de institución válido.';
        return;
    }
    if (!registerUserName.value || !registerPassword.value) {
        registerError.value = 'Nombre de usuario y contraseña son obligatorios.';
        return;
    }
    // Aquí puedes añadir más validaciones (longitud de contraseña, formato de email si registerEmail.value se usa, etc.)

    // Datos para el backend. Esto debe coincidir con el DTO que espera tu endpoint PÚBLICO de registro.
    // Asumimos que UsuarioCreateDTO en el backend tiene: NombreUsuario, Contraseña, RolId.
    // Y que el endpoint público acepta InstitucionID como query param (o dentro del DTO).
    const userDataForBackend = {
        nombreUsuario: registerUserName.value,
        contraseña: registerPassword.value,
        rolId: 7, // REVISA: ¿Es 7 el RolId correcto para un nuevo usuario auto-registrado? Este ID debe existir.
        // Si tu DTO de creación en el backend espera 'institucionId', 'email', 'nombre' directamente:
        // institucionId: registerInstitucionId.value,
        // email: registerEmail.value,
        // nombreCompleto: registerName.value, // o como se llame la propiedad en el DTO
    };

    try {
        // IMPORTANTE: Esta URL y la forma de enviar datos deben coincidir con un endpoint PÚBLICO [AllowAnonymous] en tu backend.
        // La llamada actual asume que el backend espera InstitucionID en la query string.
        const response = await axiosClient.post(
            `/Usuarios/CrearUsuario?InstitucionID=${registerInstitucionId.value}`,
            userDataForBackend // Este es el cuerpo del POST que debe mapear a UsuarioCreateDTO
        );

        if (response.data && response.data.ok) { 
            alert('¡Usuario creado exitosamente! Por favor, inicia sesión.');
            isSignUp.value = false; // Volver al panel de login
            username.value = registerUserName.value; 
            password.value = '';
            
            // Limpiar formulario de registro
            registerUserName.value = '';
            registerEmail.value = ''; 
            registerName.value = '';  
            registerPassword.value = '';
            registerRepeatPass.value = '';
            registerInstitucionId.value = null;
        } else {
            registerError.value = response.data?.message || 'Error desconocido al crear usuario.';
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error.response?.data || error.message);
        registerError.value = error.response?.data?.message || 'Error al registrar usuario. Intenta de nuevo más tarde.';
    }
};

const togglePanel = (activateSignUp) => {
    isSignUp.value = activateSignUp;
    // Limpiar errores al cambiar de panel
    loginError.value = '';
    registerError.value = '';
};
</script>

<style scoped>
.father {
	height: 90vh;
}

body {
	background: #f6f5f7;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	font-family: 'Montserrat', sans-serif;
	height: 100vh;
	margin: -20px 0 50px;
}

h1 {
	font-weight: bold;
	margin: 0;
	font-size: 24px;
}

h2 {
	text-align: center;
}

p {
	font-size: 14px;
	font-weight: 100;
	line-height: 20px;
	font-weight: 300;
	letter-spacing: 0.5px;
	margin: 20px 0 30px;
}

span {
	font-size: 12px;
}

a {
	color: #282828;
	text-decoration: none;
	margin: 15px 0;
}

button:active {
	transform: scale(0.95);
}

button:focus {
	outline: none;
}

button.ghost {
	background-color: transparent;
	border-color: #FFFFFF;
}

form {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 50px;
	height: 100%;
	text-align: center;
}

.container {
	border-radius: 10px;
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
		0 10px 10px rgba(0, 0, 0, 0.22);
	position: relative;
	overflow: hidden;
	width: 768px;
	max-width: 100%;
	min-height: 480px;
}

.form-container {
	position: absolute;
	top: 0;
	height: 100%;
	transition: all 0.6s ease-in-out;
}

.sign-in-container {
	left: 0;
	width: 50%;
	z-index: 2;
}

.container.right-panel-active .sign-in-container {
	transform: translateX(100%);
	opacity: 0;
}

.sign-up-container {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.container.right-panel-active .sign-up-container {
	transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	animation: show 0.6s;
}

@keyframes show {

	0%,
	49.99% {
		opacity: 0;
		z-index: 1;
	}

	50%,
	100% {
		opacity: 1;
		z-index: 5;
	}
}

.overlay-container {
	position: absolute;
	top: 0;
	left: 50%;
	width: 50%;
	height: 100%;
	overflow: hidden;
	transition: transform 0.6s ease-in-out;
	z-index: 100;
}

.container.right-panel-active .overlay-container {
	transform: translateX(-100%);
}

.overlay {
	background: -webkit-linear-gradient(to right, #a855f7, #06b6d4);
	background: linear-gradient(to right, #8e2fe7, #ec4899);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 0 0;
	color: #363636;
	position: relative;
	left: -100%;
	height: 100%;
	width: 200%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
	transform: translateX(50%);
}

.overlay-panel {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 40px;
	text-align: center;
	top: 0;
	height: 100%;
	width: 50%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.overlay-left {
	transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
	transform: translateX(0);
}

.overlay-right {
	right: 0;
	transform: translateX(0);
}

.container.right-panel-active .overlay-right {
	transform: translateX(20%);
}

.social-container {
	margin: 20px 0;
}

.social-container a {
	border: 1px solid #DDDDDD;
	border-radius: 50%;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	margin: 0 5px;
	height: 40px;
	width: 40px;
}

footer {
	background-color: #222;
	color: #fff;
	font-size: 14px;
	bottom: 0;
	position: fixed;
	left: 0;
	right: 0;
	text-align: center;
	z-index: 999;
}

footer p {
	margin: 10px 0;
}

footer i {
	color: red;
}

footer a {
	color: #01B6BD;
	text-decoration: none;
}
</style>