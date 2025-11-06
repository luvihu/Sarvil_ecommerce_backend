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


// import { Inquiry } from '../entities/Inquiry';
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// const getAdminEmail = (): string => {
//   const adminEmail = process.env.ADMIN_EMAIL;
//   if (!adminEmail) {
//     throw new Error('ADMIN_EMAIL no está configurado en las variables de entorno');
//   }
//   return adminEmail;
// };

// const ensureContact = async (email: string) => {
//   try {
//     await resend.contacts.create({
//       email: email,
//       audienceId: 'your-audience-id', // Opcional pero recomendado
//       firstName: 'Cliente' // Puedes personalizar
//     });
//     console.log(`Contacto verificado/agregado: ${email}`);
//   } catch (error: any) {
//     // Si el contacto ya existe, ignora el error
//     if (error.message?.includes('already exists')) {
//       console.log(`Contacto ya existe: ${email}`);
//     } else {
//       console.warn(`No se pudo verificar contacto ${email}:`, error.message);
//     }
//   }
// };
 
// export const sendInquiryEmails = async (inquiry: Inquiry) => {
//   try {
//     const adminEmail = getAdminEmail(); // ← Garantizado que es string
//      await ensureContact(inquiry.email);

//     // 📩 Email al cliente
//     await resend.emails.send({
//       from:'Sarvil360 Solutions <onboarding@resend.dev>', // ← Usar dominio verificado cuando tenga
//       to: inquiry.email,
//       replyTo: adminEmail,
//       subject: '¡Gracias por tu consulta!',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
//           <h2 style="color: #0A192F;">¡Hola ${inquiry.name}!</h2>
//           <p>Gracias por contactarnos. Hemos recibido tu consulta:</p>
//           <blockquote style="background: #f5f7fa; padding: 15px; border-left: 4px solid #2563EB; margin: 15px 0;">
//             ${inquiry.message}
//           </blockquote>
//           <p>Nos comunicaremos contigo <strong>a la brevedad</strong>.</p>
//           <p>Equipo de Desarrollo Sarvil360 Solutions</p>
//         </div>
//       `,
//     });

//     // 📩 Email a ti (copia interna)
//     await resend.emails.send({
//       from: 'Notificaciones Sarvil <onboarding@resend.dev>', // ← Mismo dominio verificado
//       to: adminEmail,
//       subject: `📩 Nueva consulta: ${inquiry.selectedPlan || 'Sin plan'}`,
//       html: `
//         <div style="font-family: Arial, sans-serif;">
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
//       `,
//     });

//     console.log(`Emails enviados via Resend para consulta ID: ${inquiry.id}`);
//     return true;
    
//   } catch (error) {
//     console.error('Error enviando emails con Resend:', error);
//     throw error;
//   }
// };


// import sgMail from '@sendgrid/mail';
// import { Inquiry } from '../entities/Inquiry';

// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// export const sendInquiryEmails = async (inquiry: Inquiry) => {
//   try {
//     console.log('📤 Enviando emails via SendGrid API...');

//     // 📩 Email al cliente
//     const clientEmail = {
//       to: inquiry.email,
//       from: 'sarvil360solutions@gmail.com', // Debe ser un email verificado en SendGrid
//       subject: '¡Gracias por tu consulta! - Sarvil360 Solutions',
//        html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
//           <h2 style="color: #0A192F;">¡Hola ${inquiry.name}!</h2>
//           <p>Gracias por contactarnos. Hemos recibido tu consulta:</p>
//           <blockquote style="background: #f5f7fa; padding: 15px; border-left: 4px solid #2563EB; margin: 15px 0;">
//             ${inquiry.message}
//           </blockquote>
//           <p>Nos comunicaremos contigo <strong>a la brevedad</strong>.</p>
          
//           <p>Equipo de Desarrollo Sarvil360 Solutions</p>
//         </div>
//       `,
//     };

//     // 📩 Email a ti
//     const adminEmail = {
//       to: process.env.ADMIN_EMAIL!,
//       from: 'sarvil360solutions@gmail.com',
//       subject: `📩 Nueva consulta: ${inquiry.selectedPlan || 'Sin plan'}`,
//       html: `
//         <div style="font-family: Arial, sans-serif;">
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
//       `,
//       categories: ['admin-notification']
//     };

//     // Enviar emails en paralelo
//     await Promise.all([
//       sgMail.send(clientEmail),
//       sgMail.send(adminEmail)
//     ]);

//     console.log('Emails enviados via SendGrid API');
//     return true;
    
//   } catch (error: any) {
//     console.error('Error SendGrid API:', {
//       message: error.message,
//       response: error.response?.body
//     });
//     throw error;
//   }
// };

import emailjs from '@emailjs/nodejs';
import { Inquiry } from '../entities/Inquiry';

const EMAILJS_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID!,
  templateCustomerId: process.env.EMAILJS_TEMPLATE_CUSTOMER_ID!,
  templateAdminId: process.env.EMAILJS_TEMPLATE_ADMIN_ID!,
  publicKey: process.env.EMAILJS_PUBLIC_KEY!,
  privateKey: process.env.EMAILJS_PRIVATE_KEY!
};

export const sendInquiryEmails = async (inquiry: Inquiry) => {
  try {
    console.log('📤 Enviando emails via EmailJS...');

    // 📩 Email al cliente
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateCustomerId,
      {
        reply_to: inquiry.email,
        to_name: inquiry.name,
        message: inquiry.message,
        plan: inquiry.selectedPlan || 'Sin plan específico'
      },
      {
        publicKey: EMAILJS_CONFIG.publicKey,
        privateKey: EMAILJS_CONFIG.privateKey
      }
    );

    // 📩 Email a ti
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateAdminId,
      {
        reply_to: process.env.ADMIN_EMAIL!,
        client_name: inquiry.name,
        client_email: inquiry.email,
        client_phone: inquiry.phone || 'No proporcionado',
        plan: inquiry.selectedPlan || 'Sin plan específico',
        client_message: inquiry.message,
        inquiry_id: inquiry.id,
        date: new Date().toLocaleString()
      },
      {
        publicKey: EMAILJS_CONFIG.publicKey,
        privateKey: EMAILJS_CONFIG.privateKey
      }
    );

    console.log('Emails enviados correctamente');
    return true;
    
  } catch (error: any) {
    console.error('Error EmailJS:', {
      status: error.status,
      text: error.text,
      message: error.message
    });
    throw error;
  }
};