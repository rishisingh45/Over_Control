// ─── Campus Map (Leaflet.js) ───

let map;
let zoneMarkers = {};
let zoneCircles = {};

// Zone coordinates (matching seed data)
const ZONE_COORDS = {
    zone_main_gate: { lat: 30.9000, lng: 75.8560, radius: 80 },
    zone_block_a: { lat: 30.9010, lng: 75.8565, radius: 120 },
    zone_block_b: { lat: 30.9020, lng: 75.8570, radius: 120 },
    zone_library: { lat: 30.9015, lng: 75.8580, radius: 100 },
    zone_canteen: { lat: 30.9025, lng: 75.8575, radius: 90 },
    zone_ground: { lat: 30.9035, lng: 75.8585, radius: 200 },
    zone_admin: { lat: 30.9012, lng: 75.8590, radius: 70 },
    zone_parking: { lat: 30.8995, lng: 75.8555, radius: 150 }
};

const STATUS_COLORS = {
    green: '#34d399',
    yellow: '#fbbf24',
    red: '#f87171'
};

function initMap() {
    // Center on campus
    map = L.map('campusMap', {
        center: [30.9015, 75.8572],
        zoom: 16,
        zoomControl: true,
        attributionControl: false
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
    }).addTo(map);

    // Add zone circles and markers
    Object.entries(ZONE_COORDS).forEach(([zoneId, coords]) => {
        // Semi-transparent circle
        const circle = L.circle([coords.lat, coords.lng], {
            radius: coords.radius,
            color: '#555',
            fillColor: '#555',
            fillOpacity: 0.15,
            weight: 1,
            dashArray: '5, 5'
        }).addTo(map);

        zoneCircles[zoneId] = circle;

        // Custom HTML marker
        const marker = L.marker([coords.lat, coords.lng], {
            icon: createZoneIcon(zoneId, '—', 'green', false)
        }).addTo(map);

        marker.bindPopup(createPopupContent(zoneId, '—', 0, 0, 'green', false));
        zoneMarkers[zoneId] = marker;
    });
}

function createZoneIcon(zoneId, count, status, isPredicted) {
    const shortName = getShortName(zoneId);
    return L.divIcon({
        className: '',
        html: `
      <div class="zone-marker ${status} ${isPredicted ? 'predicted' : ''}">
        <span class="marker-count">${count}</span>
        <span class="marker-label">${shortName}</span>
      </div>
    `,
        iconSize: [56, 56],
        iconAnchor: [28, 28]
    });
}

function createPopupContent(zoneId, name, count, capacity, status, isPredicted) {
    const percent = capacity > 0 ? Math.round((count / capacity) * 100) : 0;
    const statusLabel = status === 'green' ? 'Safe' : status === 'yellow' ? 'Moderate' : 'Overcrowded';
    return `
    <div style="font-family: Inter, sans-serif; min-width: 160px;">
      <strong style="font-size: 14px;">${name || zoneId}</strong>
      ${isPredicted ? '<span style="color: #a78bfa; font-size: 11px;"> (Predicted)</span>' : ''}
      <hr style="border-color: #333; margin: 6px 0;">
      <div style="font-size: 12px; color: #aaa;">
        Count: <strong style="color: white;">${count}</strong> / ${capacity}<br>
        Occupancy: <strong style="color: ${STATUS_COLORS[status]};">${percent}%</strong><br>
        Status: <span style="color: ${STATUS_COLORS[status]};">${statusLabel}</span>
      </div>
    </div>
  `;
}

function getShortName(zoneId) {
    const map = {
        zone_main_gate: 'Gate',
        zone_block_a: 'Blk A',
        zone_block_b: 'Blk B',
        zone_library: 'Lib',
        zone_canteen: 'Food',
        zone_ground: 'Ground',
        zone_admin: 'Admin',
        zone_parking: 'Park'
    };
    return map[zoneId] || zoneId;
}

function updateMapZones(zones) {
    zones.forEach(zone => {
        const marker = zoneMarkers[zone.zoneId];
        const circle = zoneCircles[zone.zoneId];

        if (marker) {
            marker.setIcon(createZoneIcon(
                zone.zoneId,
                zone.currentCount,
                zone.status,
                zone.isPredicted
            ));
            marker.setPopupContent(createPopupContent(
                zone.zoneId,
                zone.name,
                zone.currentCount,
                zone.maxCapacity,
                zone.status,
                zone.isPredicted
            ));
        }

        if (circle) {
            circle.setStyle({
                color: STATUS_COLORS[zone.status],
                fillColor: STATUS_COLORS[zone.status],
                fillOpacity: zone.status === 'red' ? 0.25 : 0.12,
                dashArray: zone.isPredicted ? '5, 5' : null
            });
        }
    });
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', initMap);
