/**
 * Generate 450 products for excavator parts website
 */

const fs = require('fs');

const brands = ['komatsu', 'caterpillar', 'hitachi', 'volvo', 'doosan', 'liebherr', 'kobelco', 'hyundai'];
const brandCounts = {
    komatsu: 150,
    caterpillar: 120,
    hitachi: 90,
    volvo: 50,
    doosan: 30,
    liebherr: 20,
    kobelco: 20,
    hyundai: 20
};

const categories = {
    hydraulic: {
        name: 'hydraulic',
        subcategories: ['travel-motors', 'swing-motors', 'pumps', 'valves', 'cylinders']
    },
    engine: {
        name: 'engine',
        subcategories: ['filters', 'injectors', 'turbochargers', 'water-pumps', 'starters']
    },
    undercarriage: {
        name: 'undercarriage',
        subcategories: ['track-links', 'rollers', 'sprockets', 'idlers', 'track-shoes']
    },
    electrical: {
        name: 'electrical',
        subcategories: ['sensors', 'controllers', 'displays', 'switches', 'relays']
    }
};

const categoryArray = Object.keys(categories);
const categoryDistribution = {
    hydraulic: 0.40,  // 40%
    engine: 0.25,      // 25%
    undercarriage: 0.20, // 20%
    electrical: 0.15    // 15%
};

const modelMap = {
    komatsu: ['PC200-8', 'PC200LC-8', 'PC220-8', 'PC300-8', 'PC350-8'],
    caterpillar: ['320D', '320DL', '325D', '330D', '336D'],
    hitachi: ['ZX200', 'ZX210', 'ZX240', 'ZX250', 'ZX330'],
    volvo: ['EC200', 'EC210', 'EC240', 'EC250', 'EC300'],
    doosan: ['DX200', 'DX210', 'DX225', 'DX300'],
    liebherr: ['R900', 'R910', 'R920', 'R930'],
    kobelco: ['SK200', 'SK210', 'SK235', 'SK260'],
    hyundai: ['R200', 'R210', 'R250', 'R300']
};

const products = [];
let id = 1;

// Generate products for each brand
brands.forEach(brand => {
    const count = brandCounts[brand] || 20;
    const models = modelMap[brand] || ['Model A', 'Model B'];

    for (let i = 0; i < count; i++) {
        // Determine category based on distribution
        const rand = Math.random();
        let categoryKey = 'hydraulic';
        let cumulative = 0;
        for (const [cat, prob] of Object.entries(categoryDistribution)) {
            cumulative += prob;
            if (rand <= cumulative) {
                categoryKey = cat;
                break;
            }
        }

        const category = categories[categoryKey];
        const subcat = category.subcategories[Math.floor(Math.random() * category.subcategories.length)];

        // Generate product name
        const partName = subcat.split('-').map(w =>
            w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ');
        const model = models[Math.floor(Math.random() * models.length)];
        const productName = `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${model} ${partName}`;

        // Stock status
        const stockRand = Math.random();
        let stockStatus = 'in-stock';
        let stock = 0;
        if (stockRand > 0.7) {
            stockStatus = 'in-stock';
            stock = Math.floor(Math.random() * 50) + 10;
        } else if (stockRand > 0.3) {
            stockStatus = 'low-stock';
            stock = Math.floor(Math.random() * 10) + 1;
        } else {
            stockStatus = 'out-of-stock';
            stock = 0;
        }

        // Lead time
        let leadTime = '3-5 business days';
        if (stockStatus === 'low-stock') {
            leadTime = '1-2 weeks';
        } else if (stockStatus === 'out-of-stock') {
            leadTime = '4-8 weeks';
        }

        // Generate images with ALT text
        const partNameShort = partName.toLowerCase().replace(/\s+/g, ' ');
        const images = [
            {
                url: `https://via.placeholder.com/600x400/1a365d/ffffff?text=${encodeURIComponent(brand + ' ' + partName)}`,
                alt: `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${model} ${partNameShort} front view showing mounting points and connection ports`
            },
            {
                url: `https://via.placeholder.com/600x400/2d3748/ffffff?text=${encodeURIComponent(brand + ' ' + partName + ' Side')}`,
                alt: `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${partNameShort} side view displaying identification plate and technical specifications`
            }
        ];

        // Generate specifications
        const specs = {
            'Maximum Pressure': subcat.includes('motor') || subcat.includes('pump')
                ? `${Math.floor(Math.random() * 400 + 200)} bar`
                : 'N/A',
            'Weight': `${(Math.random() * 100 + 5).toFixed(1)} kg`,
            'Material': 'High-grade steel',
            'Warranty': '12 months'
        };

        if (subcat.includes('motor')) {
            specs['Displacement'] = `${Math.floor(Math.random() * 50 + 30)} cc/rev`;
            specs['Rotation'] = 'Clockwise';
        }

        // Compatibility
        const compatibility = models.slice(0, Math.min(3, models.length));

        // Features
        const features = [
            'OEM quality',
            'Full warranty',
            'Fast shipping'
        ];

        // Tags
        const tags = [];
        if (Math.random() > 0.7) tags.push('best-seller');
        if (Math.random() > 0.8) tags.push('new-arrival');
        tags.push(brand);

        products.push({
            id: `KWSK-${String(id).padStart(6, '0')}`,
            name: productName,
            partNumber: `${brand.substring(0, 3).toUpperCase()}-${subcat.substring(0, 3).toUpperCase()}-${String(id).padStart(4, '0')}`,
            oemNumber: `${brand.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
            brand: brand,
            model: compatibility,
            category: categoryKey,
            subcategory: subcat,
            hasPrice: true,
            pricePosition: "after-name",
            stock: stock,
            stockStatus: stockStatus,
            leadTime: leadTime,
            weight: `${(Math.random() * 100 + 5).toFixed(1)} kg`,
            dimensions: `${Math.floor(Math.random() * 50 + 10)}×${Math.floor(Math.random() * 40 + 10)}×${Math.floor(Math.random() * 30 + 10)} cm`,
            images: images,
            description: `High-quality ${partNameShort} for ${brand.charAt(0).toUpperCase() + brand.slice(1)} ${model} excavator. OEM-grade replacement part with full warranty and technical support.`,
            specifications: specs,
            compatibility: compatibility,
            features: features,
            tags: tags
        });

        id++;
    }
});

// Create data structure
const data = {
    meta: {
        totalProducts: products.length,
        productsPerPage: 15,
        totalPages: Math.ceil(products.length / 15),
        lastUpdated: new Date().toISOString().split('T')[0]
    },
    categories: [
        {
            id: 'hydraulic',
            name: 'Hydraulic Components',
            count: products.filter(p => p.category === 'hydraulic').length
        },
        {
            id: 'engine',
            name: 'Engine Parts',
            count: products.filter(p => p.category === 'engine').length
        },
        {
            id: 'undercarriage',
            name: 'Undercarriage',
            count: products.filter(p => p.category === 'undercarriage').length
        },
        {
            id: 'electrical',
            name: 'Electrical',
            count: products.filter(p => p.category === 'electrical').length
        }
    ],
    brands: [
        {
            id: 'komatsu',
            name: 'Komatsu',
            count: products.filter(p => p.brand === 'komatsu').length
        },
        {
            id: 'caterpillar',
            name: 'Caterpillar',
            count: products.filter(p => p.brand === 'caterpillar').length
        },
        {
            id: 'hitachi',
            name: 'Hitachi',
            count: products.filter(p => p.brand === 'hitachi').length
        },
        {
            id: 'volvo',
            name: 'Volvo',
            count: products.filter(p => p.brand === 'volvo').length
        },
        {
            id: 'doosan',
            name: 'Doosan',
            count: products.filter(p => p.brand === 'doosan').length
        },
        {
            id: 'others',
            name: 'Others',
            count: products.filter(p => !['komatsu', 'caterpillar', 'hitachi', 'volvo', 'doosan'].includes(p.brand)).length
        }
    ],
    products: products
};

// Write to file
fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
console.log(`✅ Generated ${products.length} products successfully!`);
console.log(`📊 Category distribution:`);
Object.entries(categoryDistribution).forEach(([cat, prob]) => {
    const count = products.filter(p => p.category === cat).length;
    console.log(`   ${cat}: ${count} products (${((count / products.length) * 100).toFixed(1)}%)`);
});
console.log(`\n📦 Brand distribution:`);
Object.entries(brandCounts).forEach(([brand, count]) => {
    const actual = products.filter(p => p.brand === brand).length;
    console.log(`   ${brand}: ${actual} products`);
});

