const mysql = require('mysql2/promise');

const config = {
  host: '31.97.42.126',
  user: 'linkear',
  password: '0987021692@Rj',
  database: 'indiec',
  port: 3306,
  multipleStatements: true,
};

async function dropAllTables() {
  const connection = await mysql.createConnection(config);
  try { 
    console.log('📡 Conectado a la base de datos');
 
    // Obtener todas las tablas
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [config.database]);

    if (tables.length === 0) {
      console.log('✅ No hay tablas que eliminar.');
      return;
    }

    const tableNames = tables.map(row => `\`${row.table_name}\``).join(', ');

    const dropQuery = `
      SET FOREIGN_KEY_CHECKS = 0;
      DROP TABLE ${tableNames};
      SET FOREIGN_KEY_CHECKS = 1;
    `;

    await connection.query(dropQuery);
    console.log('🗑️ Todas las tablas han sido eliminadas correctamente.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
    console.log('🔌 Conexión cerrada.');
  }
}

dropAllTables();
