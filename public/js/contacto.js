document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    //const btnEnviarEmail = document.getElementById('btnEnviarEmail');
    const btnEnviarWhatsApp = document.getElementById('btnEnviarWhatsApp');
    
    // Configuración - reemplaza con tus datos reales
    const config = {
        emailDestino: 'ade.culturaspalmares@gmail.com', // Correo para recibir los mensajes
        whatsappNumero: '50685913883', // Número de WhatsApp con código de país
        asuntoEmail: 'Mensaje desde el sitio web ADE Culturas Palmareñas'
    };
    
    // Validar el formulario
    function validarFormulario() {
        const nombre = document.getElementById('nombre').value.trim();
        const contacto = document.getElementById('contacto').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        
        if (!nombre || !contacto || !mensaje) {
            alert('Por favor completa todos los campos del formulario.');
            return false;
        }
        
        return { nombre, contacto, mensaje };
    }
    
    /*
    // Enviar por Email
    btnEnviarEmail.addEventListener('click', function() {
        const formData = validarFormulario();
        if (!formData) return;
        
        const { nombre, contacto, mensaje } = formData;
        const cuerpoEmail = `
            Nombre: ${nombre}
            Contacto: ${contacto}
            Mensaje: ${mensaje}
        `;
        
        const mailtoLink = `mailto:${config.emailDestino}?subject=${encodeURIComponent(config.asuntoEmail)}&body=${encodeURIComponent(cuerpoEmail)}`;
        window.location.href = mailtoLink;
    });
    */
    
    // Enviar por WhatsApp
    btnEnviarWhatsApp.addEventListener('click', function() {
        const formData = validarFormulario();
        if (!formData) return;
        
        const { nombre, contacto, mensaje } = formData;
        const textoWhatsApp = `
            *Mensaje desde el sitio web ADE Culturas Palmareñas*
            
            *Nombre:* ${nombre}
            *Contacto:* ${contacto}
            *Mensaje:*
            ${mensaje}
        `;
        
        const whatsappLink = `https://wa.me/${config.whatsappNumero}?text=${encodeURIComponent(textoWhatsApp)}`;
        window.open(whatsappLink, '_blank');
    });
    
    // Opcional: Mostrar confirmación cuando se envíe desde el cliente de email
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Gracias por tu mensaje. Se abrirá tu cliente de correo para que puedas enviarlo.');
    });
});
