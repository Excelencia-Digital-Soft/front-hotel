// src/config/roles.js
export const ROLES = Object.freeze({
    DIRECTOR: 1,
    ADMINISTRADOR: 2, // 
    CAJERO: 3, // Cajero
    MUCAMA: 4, // Mucama
    CAJERO_STOCK: 5, // Cajero de Stock
    EXCELENCIA_ADMIN: 6, // Excelencia Administrativa
    USUARIO: 7, // Usuario
    ADMINISTRADOR_SISTEMA: 8, // Administrador
});

// Opcional: una función helper para obtener el nombre del rol a partir del ID (si lo necesitas en la UI)
export function getRoleName(roleId) {
    for (const roleName in ROLES) {
        if (ROLES[roleName] === roleId) {
            // Puedes devolver un nombre más amigable aquí
            switch (roleId) {
                case ROLES.DIRECTOR: return "Director";
                case ROLES.ADMIN: return "Administrador";
                case ROLES.CAJERO: return "Cajero";
                case ROLES.MUCAMA: return "Mucama";
                case ROLES.CAJERO_STOCK: return "Cajero de Stock";
                case ROLES.EXCELENCIAADMIN: return "Excelencia Administrativa";
                case ROLES.USUARIO: return "Usuario";
                case ROLES.ADMINISTRADOR_SISTEMA: return "Administrador del Sistema";
                default: return "Desconocido";
            }
        }
    }
    return "Rol Desconocido";
}      
