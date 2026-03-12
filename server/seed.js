require('dotenv').config();
const mongoose = require('mongoose');
const Zone = require('./models/Zone');

const zones = [
    {
        zoneId: 'zone_main_gate',
        name: 'Main Gate / Entry',
        wifiSSIDs: ['GATE_AP', 'MAIN_GATE_WIFI', 'ENTRY_ROUTER'],
        maxCapacity: 200,
        currentCount: 0,
        status: 'green',
        lat: 30.9000,
        lng: 75.8560,
        radius: 80,
        neighbors: ['zone_block_a', 'zone_parking'],
        ipRanges: ['192.168.1.0/24']
    },
    {
        zoneId: 'zone_block_1',
        name: 'Block A',
        wifiSSIDs: ['BLOCK_A_WIFI', 'BLOCK_A_5G', 'CLASS_A_ROUTER'],
        maxCapacity: 300,
        currentCount: 0,
        status: 'green',
        lat: 30.681285,
        lng: 76.605088,
        radius: 120,
        neighbors: ['zone_main_gate', 'zone_block_b', 'zone_library'],
        ipRanges: ['192.168.2.0/24']
    },
    {
        zoneId: 'zone_block_b',
        name: 'Block B (Classrooms)',
        wifiSSIDs: ['BLOCK_B_WIFI', 'BLOCK_B_5G', 'CLASS_B_ROUTER'],
        maxCapacity: 300,
        currentCount: 0,
        status: 'green',
        lat: 30.9020,
        lng: 75.8570,
        radius: 120,
        neighbors: ['zone_block_a', 'zone_canteen', 'zone_admin'],
        ipRanges: ['192.168.3.0/24']
    },
    {
        zoneId: 'zone_library',
        name: 'Library',
        wifiSSIDs: ['LIB_ROUTER', 'LIBRARY_WIFI', 'LIB_5G'],
        maxCapacity: 150,
        currentCount: 0,
        status: 'green',
        lat: 30.9015,
        lng: 75.8580,
        radius: 100,
        neighbors: ['zone_block_a', 'zone_admin'],
        ipRanges: ['192.168.4.0/24']
    },
    {
        zoneId: 'zone_canteen',
        name: 'Canteen / Food Court',
        wifiSSIDs: ['CANTEEN_AP', 'FOOD_WIFI', 'CANTEEN_5G'],
        maxCapacity: 150,
        currentCount: 0,
        status: 'green',
        lat: 30.9025,
        lng: 75.8575,
        radius: 90,
        neighbors: ['zone_block_b', 'zone_ground'],
        ipRanges: ['192.168.5.0/24']
    },
    {
        zoneId: 'zone_ground',
        name: 'Ground / Sports Area',
        wifiSSIDs: ['GROUND_AP', 'SPORTS_WIFI', 'GROUND_5G'],
        maxCapacity: 500,
        currentCount: 0,
        status: 'green',
        lat: 30.9035,
        lng: 75.8585,
        radius: 200,
        neighbors: ['zone_canteen', 'zone_parking'],
        ipRanges: ['192.168.6.0/24']
    },
    {
        zoneId: 'zone_admin',
        name: 'Admin Block',
        wifiSSIDs: ['ADMIN_WIFI', 'ADMIN_AP', 'OFFICE_ROUTER'],
        maxCapacity: 80,
        currentCount: 0,
        status: 'green',
        lat: 30.9012,
        lng: 75.8590,
        radius: 70,
        neighbors: ['zone_block_b', 'zone_library'],
        ipRanges: ['192.168.7.0/24']
    },
    {
        zoneId: 'zone_parking',
        name: 'Parking Area',
        wifiSSIDs: ['PARKING_WIFI', 'PARK_AP'],
        maxCapacity: 250,
        currentCount: 0,
        status: 'green',
        lat: 30.8995,
        lng: 75.8555,
        radius: 150,
        neighbors: ['zone_main_gate', 'zone_ground'],
        ipRanges: ['192.168.8.0/24']
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅  Connected to MongoDB');

        await Zone.deleteMany({});
        console.log('🗑️  Cleared existing zones');

        await Zone.insertMany(zones);
        console.log('🌱  Seeded 8 campus zones successfully!');

        zones.forEach(z => {
            console.log(`   📍 ${z.name} — capacity: ${z.maxCapacity}, SSIDs: [${z.wifiSSIDs.join(', ')}]`);
        });

        await mongoose.disconnect();
        console.log('\n✅  Done. Database seeded.');
        process.exit(0);
    } catch (err) {
        console.error('❌  Seed error:', err.message);
        process.exit(1);
    }
}

seed();
