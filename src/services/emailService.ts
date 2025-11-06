// import nodemailer from 'nodemailer';
// import { Inquiry } from '../entities/Inquiry';

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD
//   },
//   connectionTimeout: 30000, // 30 segundos
//   socketTimeout: 30000,     // 30 segundos
//   greetingTimeout: 30000,   // 30 segundos
//   dnsTimeout: 30000,        // 30 segundos
//   // Intentar reconexión automática
//   retries: 3,
//   // Pool de conexiones
//   pool: true,
//   maxConnections: 5,
//   maxMessages: 100
// });

// transporter.verify((error: Error | null, success: boolean) => {
//   if (error) {
//     console.log('Error al conectar con el servidor de email:', error);
//   } else {
//     console.log('Servidor de email listo para enviar mensajes');
//   }
// });

// export const sendInquiryEmails = async (inquiry: Inquiry) => {
//   try {
//   // 📩 Correo al cliente
//   await transporter.sendMail({
//     from: `"Sarvil360 Solutions" <${process.env.EMAIL_USER}>`,
//     to: inquiry.email,
//     subject: '¡Gracias por tu consulta!',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
//         <h2 style="color: #0A192F;">¡Hola ${inquiry.name}!</h2>
//         <p>Gracias por contactarnos. Hemos recibido tu consulta:</p>
//         <blockquote style="background: #f5f7fa; padding: 15px; border-left: 4px solid #2563EB; margin: 15px 0;">
//           ${inquiry.message}
//         </blockquote>
//         <p>Nos comunicaremos contigo <strong>a la brevedad</strong> por correo o WhatsApp.</p>
//         <p>Equipo de Desarrollo y Diseño Sarvil</p>
//       </div>
//     `,
//   });

//   // 📩 Correo a ti (copia interna)
//   await transporter.sendMail({
//     from: `"Notificaciones" <${process.env.EMAIL_USER}>`,
//     to: process.env.ADMIN_EMAIL,
//     subject: `📩 Nueva consulta: ${inquiry.selectedPlan || 'Sin plan'}`,
//     html: `
//        <div style="font-family: Arial, sans-serif;">
//           <h3 style="color: #0A192F;">Nueva consulta recibida</h3>
//           <p><strong>Nombre:</strong> ${inquiry.name}</p>
//           <p><strong>Correo:</strong> ${inquiry.email}</p>
//           <p><strong>Teléfono:</strong> ${inquiry.phone || '—'}</p>
//           <p><strong>Plan:</strong> ${inquiry.selectedPlan || '—'}</p>
//           <p><strong>Mensaje:</strong></p>
//           <div style="background: #f5f7fa; padding: 15px; border-left: 4px solid #2563EB; margin: 15px 0;">
//             ${inquiry.message}
//           </div>
//           <hr>
//           <p style="color: #666; font-size: 12px;">
//             ID: ${inquiry.id} | Fecha: ${new Date().toLocaleString()}
//           </p>
//         </div>
//     `,
//   });

//    console.log(`Emails enviados para consulta ID: ${inquiry.id}`);
//     return true;
    
//   } catch (error) {
//     console.error('Error enviando emails:', error);
//     throw new Error('No se pudieron enviar los emails');
//   }
// };


import { Inquiry } from '../entities/Inquiry';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const getAdminEmail = (): string => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL no está configurado en las variables de entorno');
  }
  return adminEmail;
};
 const getReplyToEmail = (): string => {
  return process.env.REPLY_TO_EMAIL || 'sarvil360solutions@gmail.com';
};

export const sendInquiryEmails = async (inquiry: Inquiry) => {
  try {
    const adminEmail = getAdminEmail(); // ← Garantizado que es string
    const replyToEmail = getReplyToEmail();

    // 📩 Email al cliente
    await resend.emails.send({
      from:'Sarvil360 Solutions <onboarding@resend.dev>', // ← Usar dominio verificado cuando tenga
      to: inquiry.email,
      replyTo: replyToEmail,
      subject: '¡Gracias por tu consulta!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
          <h2 style="color: #0A192F;">¡Hola ${inquiry.name}!</h2>
          <p>Gracias por contactarnos. Hemos recibido tu consulta:</p>
          <blockquote style="background: #f5f7fa; padding: 15px; border-left: 4px solid #2563EB; margin: 15px 0;">
            ${inquiry.message}
          </blockquote>
          <p>Nos comunicaremos contigo <strong>a la brevedad</strong>.</p>
          <p>Equipo de Desarrollo Sarvil360 Solutions</p>
        </div>
      `,
    });

    // 📩 Email a ti (copia interna)
    await resend.emails.send({
      from: 'Notificaciones Sarvil <onboarding@resend.dev>', // ← Mismo dominio verificado
      to: adminEmail,
      subject: `📩 Nueva consulta: ${inquiry.selectedPlan || 'Sin plan'}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h3 style="color: #0A192F;">Nueva consulta recibida</h3>
          <p><strong>Nombre:</strong> ${inquiry.name}</p>
          <p><strong>Correo:</strong> ${inquiry.email}</p>
          <p><strong>Teléfono:</strong> ${inquiry.phone || '—'}</p>
          <p><strong>Plan:</strong> ${inquiry.selectedPlan || '—'}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f5f7fa; padding: 15px; border-left: 4px solid #2563EB; margin: 15px 0;">
            ${inquiry.message}
          </div>
          <hr>
          <p style="color: #666; font-size: 12px;">
            ID: ${inquiry.id} | Fecha: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    console.log(`Emails enviados via Resend para consulta ID: ${inquiry.id}`);
    return true;
    
  } catch (error) {
    console.error('Error enviando emails con Resend:', error);
    throw error;
  }
};