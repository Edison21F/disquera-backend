import * as bcrypt from 'bcryptjs';

const plainPassword = 'MiPassword123!';
const hash = '$2b$10$RCNLzjBGqtOkpp6T/3Hj6eLF2rYuG0LONi9n/Rj2CFIq/yrHFVSIW';

bcrypt.compare(plainPassword, hash).then(result => {
  console.log('¿Contraseña válida?', result);
});
