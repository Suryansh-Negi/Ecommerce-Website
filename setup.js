const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up E-Commerce Application...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envContent = `MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here_change_in_production_${Date.now()}
PORT=5000`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
} else {
  console.log('✅ .env file already exists');
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
exec('npm install', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error installing backend dependencies:', error);
    return;
  }
  console.log('✅ Backend dependencies installed');

  // Install frontend dependencies
  console.log('\n📦 Installing frontend dependencies...');
  exec('cd client && npm install', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error installing frontend dependencies:', error);
      return;
    }
    console.log('✅ Frontend dependencies installed');

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Run: node seed.js (to populate database with sample data)');
    console.log('3. Run: npm run dev (to start backend server)');
    console.log('4. Run: cd client && npm start (to start frontend)');
    console.log('\n🌐 Application will be available at:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend:  http://localhost:5000');
  });
});

