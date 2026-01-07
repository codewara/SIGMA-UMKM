// Generate bcrypt password hashes for seed data
const bcrypt = require('bcrypt');

const passwords = [
    { label: 'ADMIN (admin123)', password: 'admin123' },
    { label: 'PEJABAT (pejabat123)', password: 'pejabat123' },
    { label: 'UMKM_OWNER (owner123)', password: 'owner123' },
];

async function generateHashes() {
    console.log('\n🔐 Generating bcrypt password hashes (12 rounds)...\n');

    for (const { label, password } of passwords) {
        const hash = await bcrypt.hash(password, 12);
        console.log(`${label}:`);
        console.log(`"${hash}"`);
        console.log('');
    }

    console.log('✅ Copy these hashes to seed_mongo.js\n');
}

generateHashes().catch(console.error);
