const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function createAdmin() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin'
    });

    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin(); 